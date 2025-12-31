const config = {
    development: {
        apiUrl: 'https://16layzd1jd.execute-api.sa-east-1.amazonaws.com'
    },
    staging: {
        apiUrl: 'https://16layzd1jd.execute-api.sa-east-1.amazonaws.com'
    },
    production: {
        apiUrl: 'https://16layzd1jd.execute-api.sa-east-1.amazonaws.com'
    }
};

const env = import.meta.env.MODE || 'development';

export const API_URL = config[env]?.apiUrl || config.development.apiUrl;
