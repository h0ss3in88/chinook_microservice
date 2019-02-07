module.exports = {
    'pgHost': process.env.POSTGRES_HOST || 'localhost',
    'pgPort': process.env.POSTGRES_PORT || 5432,
    'pgUser': process.env.POSTGRES_USER || 'hussein',
    'pgPassword': process.env.POSTGRES_PASS || '123456',
    'pgDb': process.env.POSTGRES_DATABASE || 'chinook'
};
