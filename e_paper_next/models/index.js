import sequelize from '../lib/db';
import Edition from './Edition';
import Page from './Page';
import Article from './Article';
import Hotspot from './Hotspot';

// Define Model Associations safely (prevents duplicate alias errors on Next.js hot reload)
if (!Edition.associations?.pages) {
  Edition.hasMany(Page, { foreignKey: 'editionId', as: 'pages', onDelete: 'CASCADE' });
}
if (!Page.associations?.edition) {
  Page.belongsTo(Edition, { foreignKey: 'editionId', as: 'edition' });
}

if (!Edition.associations?.articles) {
  Edition.hasMany(Article, { foreignKey: 'editionId', as: 'articles', onDelete: 'CASCADE' });
}
if (!Article.associations?.edition) {
  Article.belongsTo(Edition, { foreignKey: 'editionId', as: 'edition' });
}

if (!Page.associations?.hotspots) {
  Page.hasMany(Hotspot, { foreignKey: 'pageId', as: 'hotspots', onDelete: 'CASCADE' });
}
if (!Hotspot.associations?.page) {
  Hotspot.belongsTo(Page, { foreignKey: 'pageId', as: 'page' });
}

if (!Article.associations?.hotspots) {
  Article.hasMany(Hotspot, { foreignKey: 'articleId', as: 'hotspots', onDelete: 'CASCADE' });
}
if (!Hotspot.associations?.article) {
  Hotspot.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });
}

export {
  sequelize,
  Edition,
  Page,
  Article,
  Hotspot,
};

let syncPromise = null;

export async function initDatabase(force = false) {
  if (syncPromise && !force) return syncPromise;
  syncPromise = (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      console.log('✅ Sequelize models synchronized with MySQL database.');
      return true;
    } catch (err) {
      console.warn('⚠️ Unable to synchronize MySQL database models:', err.message);
      return false;
    }
  })();
  return syncPromise;
}
