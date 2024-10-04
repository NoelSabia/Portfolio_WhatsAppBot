import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';

interface Birthday
{
  day: number;
  month: number;
  year: number;
}

interface Person
{
  name: string;
  birthday: Birthday;
  tel_num: number;
}

//Helperfunction for Interface Person to fill up the Interface Birthday
function init_bd(bd: string): Birthday
{
  let birthdate_split = bd.split(".").map(str => parseInt(str, 10));
  const fill_bd_interface: Birthday = {
    day: birthdate_split[0],
    month: birthdate_split[1],
    year: birthdate_split[2]
  };
  return (fill_bd_interface);
}

//connect with db and insert all the data from Person[]
async function connect_with_db(people_interface : Person[]) : Promise<void>
{
  try
  {
    const connection = await mysql.createConnection({
      host: 'database',
      port: 3306,
      user: 'root',
      password: '',
      database: 'bot_db'
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bot_db (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birthday_day INT NOT NULL,
        birthday_month INT NOT NULL,
        birthday_year INT NOT NULL,
        tel_num BIGINT
      )
    `);

    const insertQuery = `INSERT INTO bot_db(name, birthday_day, birthday_month, birthday_year, tel_num) VALUES (?, ?, ?, ?, ?)`;

    for (const person of people_interface)
    {
      await connection.execute(insertQuery, [
        person.name,
        person.birthday.day,
        person.birthday.month,
        person.birthday.year,
        person.tel_num
      ]);
    }
  }
  catch(error)
  {
    console.log("Error inserting data: ", error);
  }
}

function delay(ms: number): Promise<void>
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

//reads people.txt and put the values in people_interface than calls connect_with_db() to insert data in db
export async function fill_db(): Promise<void>
{
  let people_interface: Person[] = [];
  const file: string = readFileSync('add_people/people.txt', 'utf-8');

  let tmp_file: string[] = file.split(/[,|\n]+/).map(str => str.trim());

  for (let i: number = 0; i < tmp_file.length; i++)
	{
    const tmp_person: Person = {
      name: tmp_file[i++],
      birthday: init_bd(tmp_file[i++]),
      tel_num: parseInt(tmp_file[i])
    };
    people_interface.push(tmp_person);
  }
  await delay(15000);
  connect_with_db(people_interface);
}
