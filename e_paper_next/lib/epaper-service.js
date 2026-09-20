import { initDatabase, Edition, Page, Article, Hotspot } from '../models';
import { getMemoryStore, updateMemoryStore, initialSeedData } from './seed-data';

export async function getEditionsList() {
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      const editions = await Edition.findAll({
        order: [['publishDate', 'DESC'], ['id', 'DESC']],
        include: [{ model: Page, as: 'pages', attributes: ['id', 'pageNumber', 'pageTitle', 'thumbUrl'] }],
      });
      if (editions && editions.length > 0) return editions.map(e => e.toJSON());
    } catch (err) {
      console.warn('Sequelize fetch failed, using fallback store:', err.message);
    }
  }

  const store = getMemoryStore();
  return [{
    ...store.edition,
    pages: store.pages.map(p => ({ id: p.id, pageNumber: p.pageNumber, pageTitle: p.pageTitle, thumbUrl: p.thumbUrl })),
  }];
}

export async function getEditionById(editionId) {
  const idNum = parseInt(editionId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      let edition = await Edition.findByPk(idNum, {
        include: [
          {
            model: Page,
            as: 'pages',
            include: [
              {
                model: Hotspot,
                as: 'hotspots',
                include: [{ model: Article, as: 'article' }],
              },
            ],
          },
          {
            model: Article,
            as: 'articles',
          },
        ],
        order: [
          [{ model: Page, as: 'pages' }, 'pageNumber', 'ASC'],
          [{ model: Page, as: 'pages' }, { model: Hotspot, as: 'hotspots' }, 'displayOrder', 'ASC'],
        ],
      });

      // If MySQL is active but edition 1 is not found, seed initial dataset to MySQL
      if (!edition && idNum === 1) {
        const count = await Edition.count();
        if (count === 0) {
          await seedDatabase();
          edition = await Edition.findByPk(idNum, {
            include: [
              {
                model: Page,
                as: 'pages',
                include: [
                  {
                    model: Hotspot,
                    as: 'hotspots',
                    include: [{ model: Article, as: 'article' }],
                  },
                ],
              },
              {
                model: Article,
                as: 'articles',
              },
            ],
            order: [
              [{ model: Page, as: 'pages' }, 'pageNumber', 'ASC'],
              [{ model: Page, as: 'pages' }, { model: Hotspot, as: 'hotspots' }, 'displayOrder', 'ASC'],
            ],
          });
        }
      }

      if (edition) return edition.toJSON();
    } catch (err) {
      console.warn('Sequelize edition lookup failed:', err.message);
    }
  }

  const store = getMemoryStore();
  const pagesWithHotspots = store.pages.map(p => {
    const pageHotspots = store.hotspots
      .filter(h => h.pageId === p.id)
      .map(h => ({
        ...h,
        article: store.articles.find(a => a.id === h.articleId) || null,
      }));
    return {
      ...p,
      hotspots: pageHotspots,
    };
  });

  return {
    ...store.edition,
    pages: pagesWithHotspots,
    articles: store.articles,
  };
}

export async function getArticleById(articleId) {
  const idNum = parseInt(articleId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      const article = await Article.findByPk(idNum, {
        include: [
          { model: Edition, as: 'edition', attributes: ['id', 'title', 'publishDate'] },
          { model: Hotspot, as: 'hotspots' },
        ],
      });
      if (article) return article.toJSON();
    } catch (err) {
      console.warn('Sequelize article lookup failed:', err.message);
    }
  }

  const store = getMemoryStore();
  const article = store.articles.find(a => a.id === idNum);
  if (!article) return null;
  return {
    ...article,
    edition: { id: store.edition.id, title: store.edition.title, publishDate: store.edition.publishDate },
    hotspots: store.hotspots.filter(h => h.articleId === idNum),
  };
}

export async function saveHotspot(hotspotData) {
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      if (hotspotData.isLead && hotspotData.pageId) {
        await Hotspot.update({ isLead: false }, { where: { pageId: hotspotData.pageId } });
      }
      if (hotspotData.id && typeof hotspotData.id === 'number') {
        const existing = await Hotspot.findByPk(hotspotData.id);
        if (existing) {
          await existing.update(hotspotData);
          return existing.toJSON();
        }
      }
      const created = await Hotspot.create(hotspotData);
      return created.toJSON();
    } catch (err) {
      console.warn('Sequelize save hotspot failed, saving to fallback store:', err.message);
    }
  }

  let savedItem = null;
  updateMemoryStore(store => {
    if (hotspotData.isLead && hotspotData.pageId) {
      store.hotspots = store.hotspots.map(h => h.pageId === hotspotData.pageId ? { ...h, isLead: false } : h);
    }
    if (hotspotData.id) {
      const idx = store.hotspots.findIndex(h => h.id === hotspotData.id);
      if (idx !== -1) {
        store.hotspots[idx] = { ...store.hotspots[idx], ...hotspotData };
        savedItem = store.hotspots[idx];
        return store;
      }
    }
    const newId = store.hotspots.length > 0 ? Math.max(...store.hotspots.map(h => h.id)) + 1 : 1;
    savedItem = { id: newId, ...hotspotData };
    store.hotspots.push(savedItem);
    return store;
  });
  return savedItem;
}

export async function deleteHotspot(hotspotId) {
  const idNum = parseInt(hotspotId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      await Hotspot.destroy({ where: { id: idNum } });
      return true;
    } catch (err) {
      console.warn('Sequelize delete hotspot failed:', err.message);
    }
  }

  updateMemoryStore(store => {
    store.hotspots = store.hotspots.filter(h => h.id !== idNum);
    return store;
  });
  return true;
}

export async function saveArticle(articleData) {
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      if (articleData.id && typeof articleData.id === 'number') {
        const existing = await Article.findByPk(articleData.id);
        if (existing) {
          await existing.update(articleData);
          return existing.toJSON();
        }
      }
      const created = await Article.create(articleData);
      return created.toJSON();
    } catch (err) {
      console.warn('Sequelize save article failed:', err.message);
    }
  }

  let savedArticle = null;
  updateMemoryStore(store => {
    if (articleData.id) {
      const idx = store.articles.findIndex(a => a.id === articleData.id);
      if (idx !== -1) {
        store.articles[idx] = { ...store.articles[idx], ...articleData };
        savedArticle = store.articles[idx];
        return store;
      }
    }
    const newId = store.articles.length > 0 ? Math.max(...store.articles.map(a => a.id)) + 1 : 1;
    savedArticle = { id: newId, ...articleData };
    store.articles.push(savedArticle);
    return store;
  });
  return savedArticle;
}

export async function saveEdition(editionData) {
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      if (editionData.id && typeof editionData.id === 'number') {
        const existing = await Edition.findByPk(editionData.id);
        if (existing) {
          await existing.update(editionData);
          return existing.toJSON();
        }
      }
      const created = await Edition.create(editionData);
      return created.toJSON();
    } catch (err) {
      console.warn('Sequelize save edition failed:', err.message);
    }
  }

  let savedEdition = null;
  updateMemoryStore(store => {
    if (editionData.id && store.edition.id === editionData.id) {
      store.edition = { ...store.edition, ...editionData };
      savedEdition = store.edition;
    } else {
      const newId = (store.edition?.id || 0) + 1;
      savedEdition = { id: newId, ...editionData, pages: [] };
      store.edition = savedEdition;
    }
    return store;
  });
  return savedEdition;
}

export async function deleteEdition(editionId) {
  const idNum = parseInt(editionId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      await Edition.destroy({ where: { id: idNum } });
      return true;
    } catch (err) {
      console.warn('Sequelize delete edition failed:', err.message);
    }
  }
  return true;
}

export async function getArticlesList() {
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      const articles = await Article.findAll({
        order: [['id', 'DESC']],
        include: [
          { model: Edition, as: 'edition', attributes: ['id', 'title', 'publishDate'] },
          { model: Hotspot, as: 'hotspots', attributes: ['id', 'pageId'] },
        ],
      });
      if (articles && articles.length > 0) return articles.map(a => a.toJSON());
    } catch (err) {
      console.warn('Sequelize fetch articles failed:', err.message);
    }
  }

  const store = getMemoryStore();
  return store.articles.map(a => ({
    ...a,
    edition: { id: store.edition.id, title: store.edition.title, publishDate: store.edition.publishDate },
    hotspots: store.hotspots.filter(h => h.articleId === a.id),
  }));
}

export async function deleteArticle(articleId) {
  const idNum = parseInt(articleId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      await Article.destroy({ where: { id: idNum } });
      return true;
    } catch (err) {
      console.warn('Sequelize delete article failed:', err.message);
    }
  }

  updateMemoryStore(store => {
    store.articles = store.articles.filter(a => a.id !== idNum);
    store.hotspots = store.hotspots.filter(h => h.articleId !== idNum);
    return store;
  });
  return true;
}

export async function savePage(pageData) {
  const isDbReady = await initDatabase();
  const editionId = parseInt(pageData.editionId || 1, 10);
  const pageNum = parseInt(pageData.pageNumber || 1, 10);

  if (isDbReady) {
    try {
      // 1. Ensure the parent edition exists in MySQL to avoid foreign key failure
      let edition = await Edition.findByPk(editionId);
      if (!edition) {
        edition = await Edition.create({
          id: editionId,
          title: "আজকের পত্রিকা - ঢাকা সিটি",
          publishDate: new Date().toISOString().split('T')[0],
          editionType: "ঢাকা সিটি",
          language: "bn",
          status: "published",
        });
      }

      // 2. If updating by primary key ID
      if (pageData.id && typeof pageData.id === 'number') {
        const existing = await Page.findByPk(pageData.id);
        if (existing) {
          await existing.update(pageData);
          return existing.toJSON();
        }
      }

      // 3. If a page with the same editionId and pageNumber already exists, update it
      const existingByNumber = await Page.findOne({
        where: { editionId, pageNumber: pageNum },
      });
      if (existingByNumber) {
        await existingByNumber.update({
          ...pageData,
          editionId,
          pageNumber: pageNum,
        });
        return existingByNumber.toJSON();
      }

      // 4. Otherwise create a new page in MySQL
      const created = await Page.create({
        ...pageData,
        editionId,
        pageNumber: pageNum,
      });
      return created.toJSON();
    } catch (err) {
      console.warn('Sequelize save page failed, saving to fallback store:', err.message);
    }
  }

  let savedPage = null;
  updateMemoryStore(store => {
    if (pageData.id) {
      const idx = store.pages.findIndex(p => p.id === pageData.id);
      if (idx !== -1) {
        store.pages[idx] = { ...store.pages[idx], ...pageData };
        savedPage = store.pages[idx];
        return store;
      }
    }
    const pageNumIdx = store.pages.findIndex(p => p.pageNumber === pageNum);
    if (pageNumIdx !== -1) {
      store.pages[pageNumIdx] = {
        ...store.pages[pageNumIdx],
        ...pageData,
        editionId,
        pageNumber: pageNum,
      };
      savedPage = store.pages[pageNumIdx];
      return store;
    }
    const newId = store.pages.length > 0 ? Math.max(...store.pages.map(p => p.id)) + 1 : 1;
    savedPage = {
      id: newId,
      editionId: editionId || store.edition?.id || 1,
      pageNumber: pageNum || (store.pages.length + 1),
      pageTitle: pageData.pageTitle || `Page ${pageNum}`,
      imageUrl: pageData.imageUrl || '/sample-epaper/page_1.svg',
      thumbUrl: pageData.thumbUrl || pageData.imageUrl || '/sample-epaper/page_1.svg',
      widthPx: pageData.widthPx || 1000,
      heightPx: pageData.heightPx || 1450,
    };
    store.pages.push(savedPage);
    return store;
  });
  return savedPage;
}

export async function deletePage(pageId) {
  const idNum = parseInt(pageId, 10);
  const isDbReady = await initDatabase();
  if (isDbReady) {
    try {
      await Page.destroy({ where: { id: idNum } });
      return true;
    } catch (err) {
      console.warn('Sequelize delete page failed:', err.message);
    }
  }

  updateMemoryStore(store => {
    store.pages = store.pages.filter(p => p.id !== idNum);
    store.hotspots = store.hotspots.filter(h => h.pageId !== idNum);
    return store;
  });
  return true;
}


export async function seedDatabase() {
  const isDbReady = await initDatabase(true);
  if (isDbReady) {
    try {
      await Edition.destroy({ where: {}, cascade: true });
      const createdEdition = await Edition.create(initialSeedData.edition);
      
      for (const p of initialSeedData.pages) {
        await Page.create({ ...p, editionId: createdEdition.id });
      }
      for (const a of initialSeedData.articles) {
        await Article.create({ ...a, editionId: createdEdition.id });
      }
      for (const h of initialSeedData.hotspots) {
        await Hotspot.create(h);
      }
      return { success: true, message: 'MySQL database seeded successfully via Sequelize.' };
    } catch (err) {
      console.error('MySQL seeding error:', err);
    }
  }
  updateMemoryStore(() => JSON.parse(JSON.stringify(initialSeedData)));
  return { success: true, message: 'Demo dataset reset to initial state.' };
}
