module.exports = {
    'redis_host': process.env.REDIS_HOST || 'localhost',
    'redis_port': process.env.REDIS_PORT || 5432,
    'pg_user': process.env.POSTGRES_USER || 'hussein',
    'pg_password': process.env.POSTGRES_PASS || '123456',
    'pg_db': process.env.POSTGRES_DATABASE || 'chinook',
    'microPort': process.env.PORT || 4601
};
