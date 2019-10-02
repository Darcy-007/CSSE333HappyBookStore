const Cryptr = require('cryptr');
const cryptr = new Cryptr('yeah');

const config = {
  user: 'bookstore',
  password: cryptr.decrypt("e84c2979f247fecf00e0d5fc995144c05b8b8628c46ed7392793af01dc6b"),
  server: 'golem.csse.rose-hulman.edu',
  database: 'HappyBookStore',
  option: {
    encryt: true
  }
};
const secretKey = '12345-67890-09876-54321';

module.exports = {
  config, secretKey
}
