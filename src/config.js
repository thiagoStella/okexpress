const config = {
    development: {
        apiUrl: 'https://eix8rlheu8.execute-api.sa-east-1.amazonaws.com'
    },
    staging: {
        apiUrl: 'https://eix8rlheu8.execute-api.sa-east-1.amazonaws.com'
    },
    production: {
        apiUrl: 'https://eix8rlheu8.execute-api.sa-east-1.amazonaws.com'
    }
};

const env = import.meta.env.MODE || 'development';

export const API_URL = config[env]?.apiUrl || config.development.apiUrl;
