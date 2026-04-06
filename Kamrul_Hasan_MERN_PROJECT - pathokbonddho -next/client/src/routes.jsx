import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomeLayout from "./layouts/HomeLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminTable from "./admin/AdminTable";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./admin/AdminDashboard";
import ArticleDashboard from "./admin/ArticleDashboard";
import BlogPostDashboard from "./admin/BlogPostDashboard";
import Logout from "./components/Logout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import SongDashboard from "./admin/SongDashboard";
import AlbumDashboard from "./admin/AlbumDashboard";
import PhotoDashboard from "./admin/PhotoDashboard";
import MenuDashboard from "./admin/MenuDashboard";
import HeroSectionDashboard from "./admin/HeroSectionDashboard";
import SectionDashboard from "./admin/SectionDashboard";
import VideoDashboard from "./admin/VideoDashboard";
import PageLayoutDashboardRND from "./admin/PageLayoutDashboardRND";
import TagDashboard from "./admin/TagDashboard";
import AuthorDashboard from "./admin/AuthorDashboard";
import AdsDashboard from "./admin/AdsDashboard";
import DesignDashboard from "./admin/DesignDashboard";
import NewsCreate from "./admin/NewsCreate";
import NewsList from "./admin/NewsList";
import NewsEdit from "./admin/NewsEdit";
import PhotoNewsCreate from "./admin/PhotoNewsCreate";
import PhotoNewsEdit from "./admin/PhotoNewsEdit";
import VideoNewsCreate from "./admin/VideoNewsCreate";
import VideoNewsEdit from "./admin/VideoNewsEdit";
import UserManagement from "./admin/UserManagement";
import NewsLayout from "./layouts/NewsLayout";
import NewsDetails from "./components/NewsDetails";
import AboutUsPage from "./components/AboutUsPage";



const AppRoutes = () => {
  return (
    <HelmetProvider>
      <Router>

        <Routes>
        {/* News Detail Page */}
        <Route path="/news" element={<NewsLayout />}>
          <Route path=":id" element={<NewsDetails />} />
        </Route>

        {/* About Us Page */}
        <Route path="/about-us" element={<AboutUsPage />} />

        {/* Home Page Layout */}
        <Route path="/*" element={<HomeLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Panel Layout */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/table" element={<AdminTable />} />
          <Route path="/admin/article" element={<ArticleDashboard />} />
          <Route path="/admin/tags" element={<TagDashboard />} />
          <Route path="/admin/blog" element={<BlogPostDashboard />} />
          <Route path="/admin/album" element={<AlbumDashboard />} />
          <Route path="/admin/photos" element={<PhotoDashboard />} />
          <Route path="/admin/menu" element={<MenuDashboard />} />
          <Route path="/admin/songs" element={<SongDashboard />} />
          <Route path="/admin/videos" element={<VideoDashboard />} />
          <Route path="/admin/page-layout" element={<PageLayoutDashboardRND />} />
          <Route path="/admin/author" element={<AuthorDashboard />} />
          <Route path="/admin/hero-section" element={<HeroSectionDashboard />} />
          <Route path="/admin/sections" element={<SectionDashboard />} />
          <Route path="/admin/ads" element={<AdsDashboard />} />
          <Route path="/admin/design" element={<DesignDashboard />} />
          <Route path="/admin/news/create" element={<NewsCreate />} />
          <Route path="/admin/photo-news/create" element={<PhotoNewsCreate />} />
          <Route path="/admin/video-news/create" element={<VideoNewsCreate />} />
          <Route path="/admin/news" element={<NewsList />} />
          <Route path="/admin/news/edit/:id" element={<NewsEdit />} />
          <Route path="/admin/photo-news/edit/:id" element={<PhotoNewsEdit />} />
          <Route path="/admin/video-news/edit/:id" element={<VideoNewsEdit />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Routes>

    </Router>
    </HelmetProvider>
  );
};

export default AppRoutes;
