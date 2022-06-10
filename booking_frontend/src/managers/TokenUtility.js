// TokenUtility.js

import Cookies from 'js-cookie';

const cookies = Cookies.withAttributes({ path: '/', sameSite: 'strict' }); // add domain...

const getToken = () => {
    const token = cookies.get('token');
    return (token !== undefined) ? token : 'null';
}

export default getToken;