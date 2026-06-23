import getSequelizeInstance from '../db/sequelize.js';
import User from './user-model.js';
import Album from './album.js';
import Photo from './photo.js';
import Page from './page.js';
import PageSection from './pageSection.js';
import Row from './row.js';
import Column from './column.js';
import Article from './article-model.js';
import Blog from './blog-model.js';
import Tag from './tag-model.js';
import Menu from './menu-model.js';
import Author from './author-model.js';
import News from './news-model.js';
import NewsTag from './news-tag-model.js';
import NewsCategory from './news-category-model.js';
import NewsGalleryItem from './news-gallery-item.js';
import ImageRegistry from './imageRegistry.js';
import Ad from './ad-model.js';
import Design from './design-model.js';
import Song from './song.js';
import Videos from './videos.js';
import HeroSection from './heroSections.js';
import Section from './sections.js';

const sequelize = getSequelizeInstance();

Album.hasMany(Photo, {
    foreignKey: 'albumId',
    onDelete: 'CASCADE',
});
Photo.belongsTo(Album, {
    foreignKey: 'albumId',
});

Page.hasMany(PageSection, {
    foreignKey: 'pageId',
    onDelete: 'CASCADE',
});
PageSection.belongsTo(Page, {
    foreignKey: 'pageId',
});

PageSection.hasMany(Row, {
    foreignKey: 'sectionId',
    onDelete: 'CASCADE',
});
Row.belongsTo(PageSection, {
    foreignKey: 'sectionId',
});

Row.hasMany(Column, {
    foreignKey: 'rowId',
    onDelete: 'CASCADE',
});
Column.belongsTo(Row, {
    foreignKey: 'rowId',
});

News.belongsTo(Author, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE'
});
Author.hasMany(News, {
    foreignKey: 'authorId',
    onDelete: 'CASCADE'
});

News.belongsToMany(Tag, {
    through: NewsTag,
    foreignKey: 'newsId',
    otherKey: 'tagId',
    onDelete: 'CASCADE'
});
Tag.belongsToMany(News, {
    through: NewsTag,
    foreignKey: 'tagId',
    otherKey: 'newsId',
    onDelete: 'CASCADE'
});

News.belongsToMany(Menu, {
    through: NewsCategory,
    foreignKey: 'newsId',
    otherKey: 'categoryId',
    as: 'Categories',
    onDelete: 'CASCADE'
});
Menu.belongsToMany(News, {
    through: NewsCategory,
    foreignKey: 'categoryId',
    otherKey: 'newsId',
    onDelete: 'CASCADE'
});

News.hasMany(NewsTag, {
    foreignKey: 'newsId',
    onDelete: 'CASCADE'
});
NewsTag.belongsTo(News, {
    foreignKey: 'newsId'
});

Tag.hasMany(NewsTag, {
    foreignKey: 'tagId',
    onDelete: 'CASCADE'
});
NewsTag.belongsTo(Tag, {
    foreignKey: 'tagId'
});

News.hasMany(NewsCategory, {
    foreignKey: 'newsId',
    onDelete: 'CASCADE'
});
NewsCategory.belongsTo(News, {
    foreignKey: 'newsId'
});

Menu.hasMany(NewsCategory, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});
NewsCategory.belongsTo(Menu, {
    foreignKey: 'categoryId'
});

News.hasMany(NewsGalleryItem, {
    foreignKey: 'newsId',
    as: 'GalleryItems',
    onDelete: 'CASCADE'
});
NewsGalleryItem.belongsTo(News, {
    foreignKey: 'newsId'
});

ImageRegistry.belongsTo(Article, {
    foreignKey: 'sourceId',
    constraints: false,
    as: 'article',
    scope: {
        sourceType: 'article'
    }
});

ImageRegistry.belongsTo(Blog, {
    foreignKey: 'sourceId',
    constraints: false,
    as: 'blog',
    scope: {
        sourceType: 'blog'
    }
});

ImageRegistry.belongsTo(Photo, {
    foreignKey: 'sourceId',
    constraints: false,
    as: 'photo',
    scope: {
        sourceType: 'photo'
    }
});

export {
    sequelize,
    User,
    Album,
    Photo,
    Page,
    PageSection,
    Row,
    Column,
    Article,
    Blog,
    Tag,
    Menu,
    Author,
    News,
    NewsTag,
    NewsCategory,
    NewsGalleryItem,
    ImageRegistry,
    Ad,
    Design,
    Song,
    Videos,
    HeroSection,
    Section,
};
