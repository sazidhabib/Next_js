import sequelize from '../sequelize.js';
import ContactMessage from './ContactMessage.js';
import Skill from './Skill.js';
import Experience from './Experience.js';
import Project from './Project.js';
import Media from './Media.js';

let isSynced = false;

export async function initDb() {
  if (isSynced) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    isSynced = true;
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error.message);
  }
}

export {
  sequelize,
  ContactMessage,
  Skill,
  Experience,
  Project,
  Media,
};

export function cleanImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://localhost:') || url.startsWith('http://127.0.0.1:')) {
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search;
    } catch (e) {
      return url;
    }
  }
  return url;
}
