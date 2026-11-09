// Contact-form submissions → Firestore `inquiries` collection.
// Firebase is imported on demand, so the landing page never ships it up front.
// View submissions: Firebase console → Firestore Database → inquiries.

const trim = (v, max) => String(v ?? '').trim().slice(0, max)

export async function submitInquiry(fields) {
  const [{ db }, { addDoc, collection, serverTimestamp }] = await Promise.all([
    import('./firebase'),
    import('firebase/firestore'),
  ])
  const data = {
    name: trim(fields.name, 120),
    phone: trim(fields.phone, 40),
    source: 'website-contact-form',
    createdAt: serverTimestamp(),
  }
  const email = trim(fields.email, 200)
  const topic = trim(fields.topic, 80)
  const message = trim(fields.message, 4000)
  if (email) data.email = email
  if (topic) data.topic = topic
  if (message) data.message = message
  await addDoc(collection(db, 'inquiries'), data)
}
