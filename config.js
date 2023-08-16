const devMode = Number(process.env.DEV_MODE) === 1;

const config = {
  
  /* express */
  port:   devMode   ? process.env.DEV_PORT 
                    : process.env.PROD_PORT,

  subdir: devMode   ? '' 
                    : process.env.APP_SUBDIR,

  builddir: devMode ? process.env.APP_BUILD_DIR_DEV 
                    : process.env.APP_BUILD_DIR_PROD,

  /* database */
  db: {
    host: process.env.MYSQL_DEV_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    connectTimeout: 60_000,
    multipleStatements: true, /* for stored procedures */
  },

  /* misc */
  listPerPage: 10,
  bookLimit: 100,
};

export default config;
export { config };
