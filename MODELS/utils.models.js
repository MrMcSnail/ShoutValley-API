const db = require('../db/connection');

exports.columnValidate = async (columnName) => {
  const {rows: [{exists}]} = await db.query(`
  SELECT EXISTS 
  (SELECT 1 FROM information_schema.columns 
    WHERE table_name='articles' 
    AND column_name=$1);`, [columnName]);
  return exists;
};

exports.articleIDExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
    return rows.length? true : false;
  });
};
