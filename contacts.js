const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function getAllContacts() {
  try {
    const rawData = await fs.readFile(contactsPath);
    const contacts = JSON.parse(rawData);

    return contacts;
  } catch (error) {
    console.error(error);
  }
}

async function listContacts() {
  try {
    await getAllContacts().then((contacts) => console.table(contacts));
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await getAllContacts().then((contacts) =>
      contacts.filter((contact) => contact.id === contactId)
    );

    if (contact.length < 1) {
      console.log(`There is no contact with id ${contactId}`);
      return;
    } else {
      console.table(contact);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getAllContacts().then((contacts) => contacts);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    const contactsUpdate = contacts.filter(
      (contact) => contacts.indexOf(contact) !== index
    );
    const contactsList = JSON.stringify([...contactsUpdate]);
    fs.writeFile(contactsPath, contactsList);

    console.log(`Contact with id ${contactId} was removed`);

    console.table(await getAllContacts().then((contacts) => contacts));
  } catch (error) {
    console.error(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getAllContacts().then((contacts) => contacts);

    const isInContacts = (contact) =>
      contact.name === name ||
      contact.email === email ||
      contact.phone === phone;

    if (contacts.some(isInContacts)) {
      console.warn(`Contact is already in contacts`);
      return;
    }

    const newContact = { id: nanoid(), name, email, phone };
    const contactsListUpdate = JSON.stringify([newContact, ...contacts]);
    fs.writeFile(contactsPath, contactsListUpdate);
    console.log(`Contact was successfully added`);
    console.table(await getAllContacts().then((contacts) => contacts));
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
