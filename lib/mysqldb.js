import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123456',
  database: process.env.MYSQL_DATABASE || 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const buildInsertSQL = async (tableName, field) => {
    const keys = Object.keys(field);
    const values = Object.values(field);
    const columns = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
    //console.log('SQL: ',sql, 'Values: ', values);
    return { sql, values };
};

const buildInsertSQLArray = async (tableName, dataArray) => {
    if (!dataArray || dataArray.length === 0) {
        throw new Error('dataArray is empty');
    }
    
    const keys = Object.keys(dataArray[0]);
    const columns = keys.map(k => `\`${k}\``).join(', ');
    
    const placeholders = dataArray.map(() =>
        `(${keys.map(() => '?').join(', ')})`
    ).join(', ');
    
    const values = dataArray.flatMap(row => keys.map(k => row[k]));
    
    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES ${placeholders}`;
    
    return { sql, values };
};

const buildUpdateSQLArray = (tableName, dataArray, primaryKey = 'id') => {
    if (!dataArray || dataArray.length === 0) {
        throw new Error('dataArray is empty');
    }
    
    const fields = Object.keys(dataArray[0]).filter(key => key !== primaryKey);
    const ids = dataArray.map(item => item[primaryKey]);
    
    const setClauses = fields.map(field => {
        const cases = dataArray.map(item =>
            `WHEN ${item[primaryKey]} THEN ?`
        ).join(' ');
        return `\`${field}\` = CASE \`${primaryKey}\` ${cases} END`;
    });
    
    const sql = `UPDATE \`${tableName}\` SET ${setClauses.join(', ')} WHERE \`${primaryKey}\` IN (${ids.join(', ')})`;
    
    const values = fields.flatMap(field => dataArray.map(item => item[field]));
    
    return { sql, values };
};

const buildUpdateSQL = async (tableName, field, where) => {
    const keys = Object.keys(field);
    const values = Object.values(field);
    
    const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
    
    const whereKeys = Object.keys(where);
    const whereClause = whereKeys.map(k => `\`${k}\` = ?`).join(' AND ');
    const whereValues = Object.values(where);
    
    const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE ${whereClause}`;
    return { sql, values: [...values, ...whereValues] };
};

const buildDeleteSQL = (tableName, where) => {
    const keys = Object.keys(where);
    const conditions = keys.map(k => `\`${k}\` = ?`).join(' AND ');
    const values = Object.values(where);
    const sql = `DELETE FROM \`${tableName}\` WHERE ${conditions}`;
    return { sql, values };
};

const buildSelectSQL = (tableName, options = {}) => {
    const {
        where = {},
        like = {},
        inList = {},
        all = false,
        orderBy = '',
        limit = null,
        offset = null
    } = options;
    
    let sql = `SELECT * FROM \`${tableName}\``;
    const conditions = [];
    const values = [];
    
    if (!all) {
        for (const [key, value] of Object.entries(where)) {
            conditions.push(`\`${key}\` = ?`);
            values.push(value);
        }
        
        for (const [key, value] of Object.entries(like)) {
            conditions.push(`\`${key}\` LIKE ?`);
            values.push(`%${value}%`);
        }
        
        for (const [key, list] of Object.entries(inList)) {
            if (Array.isArray(list) && list.length > 0) {
                const placeholders = list.map(() => '?').join(', ');
                conditions.push(`\`${key}\` IN (${placeholders})`);
                values.push(...list);
            }
        }
        
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
    }
    
    if (orderBy) {
        sql += ` ORDER BY ${orderBy}`;
    }
    
    if (limit !== null) {
        sql += ` LIMIT ?`;
        values.push(limit);
    }
    
    if (offset !== null) {
        sql += ` OFFSET ?`;
        values.push(offset);
    }
    
    return { sql, values };
};

export const getData = async (table, options = {}) => {
    try {
        const { sql, values } = buildSelectSQL(table, options);
        
        const [rows] = await pool.execute(sql, values);
        return { status: true, data: rows };
    } catch (error) {
        console.error('❌ Error getting data:', error.message);
        return { status: false, message: error.message };
    }
};

export const insertData = async (table, field) => {
    try {
        const { sql, values } = await buildInsertSQL(table, field);
        const [result] = await pool.execute(sql, values);
        return { status: true, id: result.insertId };
    } catch (error) {
        console.error('❌ Error saving data:', error.message);
        return { status: false, message: error.message };
    }
};

export const insertDataArray = async (table, dataArray) => {
    try {
        const { sql, values } = await buildInsertSQLArray(table, dataArray);
        const [result] = await pool.execute(sql, values);
        return { status: true, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('❌ Error saving bulk data:', error.message);
        return { status: false, message: error.message };
    }
};

export const updateData = async (table, field, where) => {
    //console.log(table, field, where)
    try {
        const { sql, values } = await buildUpdateSQL(table, field, where);
        const [result] = await pool.execute(sql, values);
        return { status: true, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('❌ Error updating data:', error.message);
        return { status: false, message: error.message };
    }
};

export const updateDataArray = async (table, dataArray, primaryKey = 'id') => {
    try {
        const { sql, values } = buildUpdateSQLArray(table, dataArray, primaryKey);
        const [result] = await pool.execute(sql, values);
        return { status: true, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('❌ Error bulk updating data:', error.message);
        return { status: false, message: error.message };
    }
};

export const deleteData = async (table, where) => {
    try {
        const { sql, values } = buildDeleteSQL(table, where);
        const [result] = await pool.execute(sql, values);
        return { status: true, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('❌ Error deleting data:', error.message);
        return { status: false, message: error.message };
    }
};

// ======================= SQL Builder & Executor =======================

// ... (โค้ดทั้งหมดที่คุณมีอยู่แล้วไม่เปลี่ยนแปลง)

// ======================= ตัวอย่างการใช้งาน =======================

// 1. ดึงข้อมูลทั้งหมด

//await getData('users', { all: true });

// 2. ดึงข้อมูลแบบ WHERE เฉพาะ id
//await getData('users', { where: { id: 5 } });

// 3. ค้นหาด้วย LIKE
//await getData('users', { like: { name: 'john' } });

// 4. WHERE IN (หลายค่า)
//await getData('users', { inList: { id: [1, 2, 3] } });

// 5. LIMIT + ORDER BY
//await getData('users', { where: { status: 'active' }, orderBy: 'created_at DESC', limit: 10 });

// 6. เพิ่มข้อมูล 1 รายการ
//await insertData('users', { name: 'John', age: 30 });

// 7. เพิ่มข้อมูลหลายรายการ
//await insertDataArray('users', [
//    { name: 'Alice', age: 28 },
//    { name: 'Bob', age: 35 }
//]);

// 8. แก้ไขข้อมูล 1 รายการ
//await updateData('users', { age: 31 }, { id: 1 });

// 9. แก้ไขหลายรายการแบบ bulk update
//await updateDataArray('users', [
//    { id: 1, age: 31 },
//    { id: 2, age: 36 }
//]);

// 10. ลบข้อมูลแบบเจาะจง
//await deleteData('users', { id: 3 });
