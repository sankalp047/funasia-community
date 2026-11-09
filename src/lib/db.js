import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { userColor } from './colors'

export const GROUP_CATEGORIES = [
  'Nonprofit',
  'Cultural',
  'Women Empowerment',
  'Education',
  'Health & Wellness',
  'Faith & Spirituality',
  'Volunteering',
  'Youth & Family',
]

const groupRef = (id) => doc(db, 'groups', id)

function senderFields(profile) {
  return {
    senderId: profile.id,
    senderName: profile.displayName,
    senderColor: profile.color ?? userColor(profile.id),
  }
}

// ---------------------------------------------------------------- groups ----

export async function createGroup({ name, description, category, privacy }, profile) {
  const ref = doc(collection(db, 'groups'))
  const batch = writeBatch(db)
  batch.set(ref, {
    name,
    nameLower: name.toLowerCase(),
    description,
    category,
    privacy, // 'public' | 'private'
    ownerId: profile.id,
    admins: [profile.id],
    memberIds: [profile.id],
    pendingIds: [],
    memberCount: 1,
    createdAt: serverTimestamp(),
    lastMessage: null,
  })
  batch.set(doc(ref, 'members', profile.id), {
    displayName: profile.displayName,
    color: profile.color ?? userColor(profile.id),
    role: 'admin',
    joinedAt: serverTimestamp(),
  })
  await batch.commit()
  return ref.id
}

export async function updateGroup(groupId, patch) {
  const data = { ...patch }
  if (patch.name) data.nameLower = patch.name.toLowerCase()
  await updateDoc(groupRef(groupId), data)
}

export async function joinGroup(group, profile) {
  const batch = writeBatch(db)
  batch.update(groupRef(group.id), {
    memberIds: [...new Set([...group.memberIds, profile.id])],
    memberCount: (group.memberCount ?? group.memberIds.length) + 1,
  })
  batch.set(doc(groupRef(group.id), 'members', profile.id), {
    displayName: profile.displayName,
    color: profile.color ?? userColor(profile.id),
    role: 'member',
    joinedAt: serverTimestamp(),
  })
  await batch.commit()
}

export async function requestToJoin(group, profile, message = '') {
  const batch = writeBatch(db)
  batch.update(groupRef(group.id), {
    pendingIds: [...new Set([...(group.pendingIds ?? []), profile.id])],
  })
  batch.set(doc(groupRef(group.id), 'requests', profile.id), {
    displayName: profile.displayName,
    color: profile.color ?? userColor(profile.id),
    message,
    requestedAt: serverTimestamp(),
  })
  await batch.commit()
}

export async function cancelRequest(group, uid) {
  const batch = writeBatch(db)
  batch.update(groupRef(group.id), {
    pendingIds: (group.pendingIds ?? []).filter((id) => id !== uid),
  })
  batch.delete(doc(groupRef(group.id), 'requests', uid))
  await batch.commit()
}

export async function approveRequest(group, request) {
  const batch = writeBatch(db)
  batch.update(groupRef(group.id), {
    pendingIds: (group.pendingIds ?? []).filter((id) => id !== request.id),
    memberIds: [...new Set([...group.memberIds, request.id])],
    memberCount: (group.memberCount ?? group.memberIds.length) + 1,
  })
  batch.set(doc(groupRef(group.id), 'members', request.id), {
    displayName: request.displayName,
    color: request.color ?? userColor(request.id),
    role: 'member',
    joinedAt: serverTimestamp(),
  })
  batch.delete(doc(groupRef(group.id), 'requests', request.id))
  await batch.commit()
}

export async function denyRequest(group, uid) {
  return cancelRequest(group, uid)
}

export async function leaveGroup(group, uid) {
  const batch = writeBatch(db)
  batch.update(groupRef(group.id), {
    memberIds: group.memberIds.filter((id) => id !== uid),
    admins: (group.admins ?? []).filter((id) => id !== uid),
    memberCount: Math.max(0, (group.memberCount ?? group.memberIds.length) - 1),
  })
  batch.delete(doc(groupRef(group.id), 'members', uid))
  await batch.commit()
}

export async function removeMember(group, uid) {
  return leaveGroup(group, uid)
}

export async function deleteGroup(groupId) {
  // MVP: subcollection docs are cleaned up lazily (Cloud Function later).
  await deleteDoc(groupRef(groupId))
}

export function subscribeGroup(groupId, cb) {
  return onSnapshot(groupRef(groupId), (snap) =>
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null),
  )
}

export function subscribeMyGroups(uid, cb) {
  const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', uid))
  return onSnapshot(q, (snap) => {
    const groups = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    groups.sort((a, b) => (b.lastMessage?.at?.toMillis() ?? 0) - (a.lastMessage?.at?.toMillis() ?? 0))
    cb(groups)
  })
}

export function subscribeAllGroups(cb) {
  const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'), limit(60))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

export function subscribeMembers(groupId, cb) {
  const q = query(collection(groupRef(groupId), 'members'), orderBy('joinedAt', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

export function subscribeRequests(groupId, cb) {
  const q = query(collection(groupRef(groupId), 'requests'), orderBy('requestedAt', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

// -------------------------------------------------------------- messages ----

export async function sendGroupMessage(group, profile, text) {
  await addDoc(collection(groupRef(group.id), 'messages'), {
    text,
    ...senderFields(profile),
    createdAt: serverTimestamp(),
  })
  await updateDoc(groupRef(group.id), {
    lastMessage: { text, senderName: profile.displayName, at: serverTimestamp() },
  })
}

export function subscribeGroupMessages(groupId, cb) {
  const q = query(
    collection(groupRef(groupId), 'messages'),
    orderBy('createdAt', 'asc'),
    limitToLast(150),
  )
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

// ------------------------------------------------------------------- DMs ----

export const dmIdFor = (a, b) => [a, b].sort().join('_')

/** Create (or reuse) the DM thread between two users and return its id. */
export async function openDm(me, other) {
  const id = dmIdFor(me.id, other.id)
  const ref = doc(db, 'dms', id)
  const existing = await getDoc(ref)
  if (!existing.exists()) {
    const batch = writeBatch(db)
    batch.set(ref, {
      participants: [me.id, other.id],
      profiles: {
        [me.id]: { displayName: me.displayName, color: me.color ?? userColor(me.id) },
        [other.id]: { displayName: other.displayName, color: other.color ?? userColor(other.id) },
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    })
    await batch.commit()
  }
  return id
}

export function subscribeMyDms(uid, cb) {
  const q = query(collection(db, 'dms'), where('participants', 'array-contains', uid))
  return onSnapshot(q, (snap) => {
    const dms = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    dms.sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
    cb(dms)
  })
}

export function subscribeDm(dmId, cb) {
  return onSnapshot(doc(db, 'dms', dmId), (snap) =>
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null),
  )
}

export async function sendDmMessage(dmId, profile, text) {
  await addDoc(collection(doc(db, 'dms', dmId), 'messages'), {
    text,
    ...senderFields(profile),
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'dms', dmId), {
    lastMessage: { text, senderName: profile.displayName, at: serverTimestamp() },
    updatedAt: serverTimestamp(),
  })
}

export function subscribeDmMessages(dmId, cb) {
  const q = query(
    collection(doc(db, 'dms', dmId), 'messages'),
    orderBy('createdAt', 'asc'),
    limitToLast(150),
  )
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

// ----------------------------------------------------------------- users ----

export async function searchUsers(prefix, excludeUid, max = 12) {
  const p = prefix.trim().toLowerCase()
  const base = collection(db, 'users')
  const q = p
    ? query(base, where('nameLower', '>=', p), where('nameLower', '<=', p + '\uf8ff'), limit(max))
    : query(base, orderBy('nameLower'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((u) => u.id !== excludeUid)
}
