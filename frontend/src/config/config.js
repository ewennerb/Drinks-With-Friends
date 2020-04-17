const prod = {
    url: {
        API_URL: 'https://fierce-scrubland-40724.herokuapp.com'
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8080'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;