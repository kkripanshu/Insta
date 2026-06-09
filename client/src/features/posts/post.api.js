const API_URL = 'http://localhost:3000/api/posts';



const getAuthHeaders = () => {

  const token = localStorage.getItem('token');



  return token

    ? { Authorization: `Bearer ${token}` }

    : {};

};



export const createPost = async ({ media, caption }) => {

  try {

    const formData = new FormData();



    formData.append('media', media);

    formData.append('caption', caption || '');



    const response = await fetch(API_URL, {

      method: 'POST',

      body: formData,

      headers: getAuthHeaders(),

      credentials: 'include',

    });



    const data = await response.json();



    return {

      ok: response.ok,

      data,

    };



  } catch (error) {

    console.error('Create Post Error:', error);



    return {

      ok: false,

      message: error.message || 'Something went wrong',

    };

  }

};



export const fetchFeed = async () => {

  try {

    const response = await fetch(API_URL, {

      method: 'GET',

      headers: getAuthHeaders(),

      credentials: 'include',

    });



    const data = await response.json();



    return {

      ok: response.ok,

      posts: data,

    };



  } catch (error) {

    console.error('Fetch Feed Error:', error);



    return {

      ok: false,

      posts: [],

      message: error.message || 'Something went wrong',

    };

  }

};



export const likePost = async (postId) => {

  try {

    const response = await fetch(`${API_URL}/${postId}/like`, {

      method: 'POST',

      headers: getAuthHeaders(),

      credentials: 'include',

    });



    const data = await response.json();



    return {

      ok: response.ok,

      data,

    };



  } catch (err) {

    console.error('Like Post Error:', err);

    return {

      ok: false,

      data: null,

      error: err.message

    };

  }

}





export const commentPost = async (postId, comment) => {

  try {

    const response = await fetch(`${API_URL}/${postId}/comment`, {

      method: 'POST',

      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify({ text: comment }),

    });



    const data = await response.json();


    return {

      ok: response.ok,

      data,

    };





  } catch (err) {

    console.error('Comment Post Error:', err);

    return {

      ok: false,

      data: null,

      error: err.message

    };

  }

}