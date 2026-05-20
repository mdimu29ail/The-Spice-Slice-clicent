/**
 * Performance & Best Practices Optimization
 * 1. Added Error Handling for robust data fetching.
 * 2. Used async/await for better readability and debugging.
 * 3. Implemented Response Validation to prevent UI crashes on server errors.
 */

const BASE_URL = 'https://the-spice-slice-server.vercel.app';

// --- ১. অ্যাপ্লিকেশন/অর্ডার ডাটা ফেচিং ---
export const myApplicationPromise = async email => {
  try {
    const response = await fetch(`${BASE_URL}/applications?email=${email}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Best Practice: সার্ভার রেসপন্স চেক করা (৪MD৪ বা ৫MD০ এরর হ্যান্ডলিং)
    if (!response.ok) {
      throw new Error(`Boutique Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch artisanal applications:', error);
    throw error; // কলার কম্পোনেন্ট যাতে এররটি হ্যান্ডেল করতে পারে
  }
};

// --- ২. ইউজারের তৈরি করা খাবারের ডাটা ফেচিং ---
export const myCreatePromise = async email => {
  try {
    const response = await fetch(`${BASE_URL}/foods?email=${email}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Boutique Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch patron creations:', error);
    throw error;
  }
};
