import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Heart,
  Menu,
  X,
  Building2,
  Layers,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, labelKey: "admin.dashboard", path: "/admin/dashboard" },
  { icon: Layers, labelKey: "admin.domains", path: "/admin/domains" },
  { icon: Calendar, labelKey: "admin.camps", path: "/admin/camps" },
  { icon: Building2, labelKey: "admin.hospitals", path: "/admin/hospitals" },
  { icon: Users, labelKey: "admin.registrations", path: "/admin/registrations" },
  { icon: Bell, labelKey: "admin.notifications", path: "/admin/notifications" },
  { icon: MessageSquare, labelKey: "admin.feedback", path: "/admin/feedback" },
  { icon: Settings, labelKey: "admin.settings", path: "/admin/settings" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t, i18n } = useTranslation();
  const { adminUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Language Switch */}
      <div className="flex gap-2 p-2 border-b bg-white">
        <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        <button onClick={() => i18n.changeLanguage("hindi")}>हिंदी</button>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-green-600" />
          <span className="text-lg">{t("admin.title")}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r transition-transform z-40
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6 border-b hidden lg:block">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg">AarogyaConnect</h1>
                <p className="text-xs text-gray-500">{t("admin.panel")}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700">
                  {adminUser?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className="text-sm">{adminUser?.name || t("admin.user")}</p>
                <p className="text-xs text-gray-500">{adminUser?.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {t("admin.logout")}
            </Button>
          </div>
        </aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
