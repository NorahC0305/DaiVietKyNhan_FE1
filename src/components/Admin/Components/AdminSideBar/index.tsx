"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@atoms/ui/button";
import LucideIcon from "@atoms/LucideIcon";
import { COLORS } from "@constants/colors";
import { ROUTES } from "@routes";
import { useRouter, usePathname } from "next/navigation";

// Types are now defined in @types/IPages/index.d.ts

// Constants
const INITIAL_ACTIVE_ITEM = "user-management";
const INITIAL_EXPANDED_MENUS = new Set([INITIAL_ACTIVE_ITEM]);
const TRANSITION_DURATION = 300;

// CSS Classes
const SIDEBAR_CLASSES = {
  container:
    "h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col transition-all duration-300",
  collapsed: "w-16 p-2",
  expanded: "w-80 p-6",
  mobile: "fixed top-0 left-0 z-50 h-screen w-80 p-6",
  desktop: "lg:relative lg:z-auto",
} as const;

const BUTTON_CLASSES = {
  mainItem:
    "w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 hover:scale-[1.02]",
  subItem:
    "w-full justify-start p-3 h-auto rounded-lg transition-all duration-200 hover:scale-[1.01]",
  collapse:
    "h-8 w-8 rounded-lg hover:bg-orange-100 transition-colors hidden lg:flex",
} as const;

const MENU_ITEMS: IPAGES.MenuItem[] = [
  {
    id: "user-management",
    label: "Quản lý Người dùng",
    icon: "Users",
    subItems: [
      { id: "audience-info", label: "Thông tin khán giả", icon: "User" },
      { id: "scores-edit", label: "Điểm số & chỉnh sửa điểm", icon: "Star" },
      { id: "gift-code", label: "Mã GIF", icon: "Gift" },

      {
        id: "received-letters",
        label: "Các bức thư được gửi về",
        icon: "Mail",
      },
    ],
  },
  {
    id: "question-game-management",
    label: "Quản lý Câu hỏi & Trò chơi",
    icon: "HelpCircle",
    subItems: [
      { id: "question-bank", label: "Ngân hàng câu hỏi", icon: "Plus" },
      // {
      //   id: "question-statistics",
      //   label: "Thống kê tỷ lệ trả lời",
      //   icon: "TrendingUp",
      // },
    ],
  },
  {
    id: "manage-library",
    label: "Quản lý thư viện",
    icon: "BookOpen",
    subItems: [
      { id: "ky-nhan-list", label: "Danh sách kỳ nhân", icon: "Users" },
      { id: "card", label: "Thẻ kỳ nhân", icon: "CreditCard" },
      { id: "ky-nhan-summary", label: "Tóm tắt kỳ nhân( Dành cho câu hỏi)", icon: "FileText" },
      { id: "lib-card", label: "Chi tiết kỳ nhân", icon: "Library" },
      { id: "card-story", label: "Chi tiết kỳ nhân (Câu chuyện mở rộng)", icon: "ScrollText" },
    ],
  },
  {
    id: "statistics-reports",
    label: "Thống kê & Báo cáo",
    icon: "BarChart3",
    subItems: [
      {
        id: "statistics-user",
        label: "Thống kê người dùng và lượt chơi",
        icon: "Activity",
      },
      // {
      //   id: "statistics-overview",
      //   label: "Báo cáo tổng hợp",
      //   icon: "ChartLine",
      // },
    ],
  },
  {
    id: "system-config",
    label: "Hệ thống",
    icon: "Settings",
    subItems: [
      { id: "release-date", label: "Ngày phát hành", icon: "Calendar" },
    ],
  },
];

// Style constants
const STYLES = {
  inactive: {
    backgroundColor: "transparent",
    color: COLORS.TEXT.DARK,
    border: "none",
    boxShadow: "none",
  },
  primary: {
    backgroundColor: COLORS.BACKGROUND.ORANGE,
    color: COLORS.TEXT.LIGHT,
    border: `1px solid ${COLORS.BORDER.ORANGE}`,
    boxShadow: COLORS.BOX_SHADOW.ORANGE,
  },
  secondary: {
    backgroundColor: "#FF6B35",
    color: COLORS.TEXT.LIGHT,
    border: "1px solid #FF6B35",
    boxShadow: "0px 4px 20px rgba(255, 107, 53, 0.2)",
  },
} as const;

const AdminSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Route maps
  const SUBITEM_ROUTE_MAP: Record<string, string> = useMemo(
    () => ({
      "audience-info": ROUTES.ADMIN_DASHBOARD.USER.INFO,
      "scores-edit": ROUTES.ADMIN_DASHBOARD.USER.POINTS,
      "gift-code": ROUTES.ADMIN_DASHBOARD.USER.GIFT_CODE,
      "photo-submission": ROUTES.ADMIN_DASHBOARD.USER.SUBMITTED_IMAGE,
      "received-letters": ROUTES.ADMIN_DASHBOARD.USER.SENT_MAIL,
      "content-info": ROUTES.ADMIN_DASHBOARD.CONTENT.INFO,
      "content-edit": ROUTES.ADMIN_DASHBOARD.CONTENT.INFO,
      "question-bank": ROUTES.ADMIN_DASHBOARD.QUESTION.BANK,
      "question-statistics": ROUTES.ADMIN_DASHBOARD.QUESTION.STATISTICS,
      card: ROUTES.ADMIN_DASHBOARD.LIBRARY.CARD,
      "card-story": ROUTES.ADMIN_DASHBOARD.LIBRARY.CARD_STORY,
      "lib-card": ROUTES.ADMIN_DASHBOARD.LIBRARY.LIB_CARD,
      "ky-nhan-list": ROUTES.ADMIN_DASHBOARD.LIBRARY.KY_NHAN_LIST,
      "ky-nhan-summary": ROUTES.ADMIN_DASHBOARD.LIBRARY.KY_NHAN_SUMMARY,
      "statistics-overview": ROUTES.ADMIN_DASHBOARD.STATISTICS.OVERVIEW,
      "statistics-user": ROUTES.ADMIN_DASHBOARD.STATISTICS.USER,
      "release-date": ROUTES.ADMIN_DASHBOARD.SYSTEM.RELEASE_DATE,
    }),
    []
  );

  const MAINITEM_ROUTE_MAP: Record<string, string> = useMemo(
    () => ({
      "content-management": ROUTES.ADMIN_DASHBOARD.CONTENT.INFO,
      "question-game-management": ROUTES.ADMIN_DASHBOARD.QUESTION.BANK,
      "statistics-reports": ROUTES.ADMIN_DASHBOARD.STATISTICS.USER,
      "release-date": ROUTES.ADMIN_DASHBOARD.SYSTEM.RELEASE_DATE,
      "manage-library": ROUTES.ADMIN_DASHBOARD.LIBRARY.LIB_CARD,
    }),
    []
  );

  // Reverse map from route -> active state
  const ROUTE_TO_ACTIVE_STATE: Record<
    string,
    { parentId: string; subId?: string }
  > = useMemo(
    () => ({
      [ROUTES.ADMIN_DASHBOARD.USER.INFO]: {
        parentId: "user-management",
        subId: "audience-info",
      },
      [ROUTES.ADMIN_DASHBOARD.USER.POINTS]: {
        parentId: "user-management",
        subId: "scores-edit",
      },
      [ROUTES.ADMIN_DASHBOARD.USER.GIFT_CODE]: {
        parentId: "user-management",
        subId: "gift-code",
      },
      [ROUTES.ADMIN_DASHBOARD.USER.SUBMITTED_IMAGE]: {
        parentId: "user-management",
        subId: "photo-submission",
      },
      [ROUTES.ADMIN_DASHBOARD.USER.SENT_MAIL]: {
        parentId: "user-management",
        subId: "received-letters",
      },
      [ROUTES.ADMIN_DASHBOARD.CONTENT.INFO]: { parentId: "content-management" },
      [ROUTES.ADMIN_DASHBOARD.QUESTION.BANK]: {
        parentId: "question-game-management",
        subId: "question-bank",
      },
      [ROUTES.ADMIN_DASHBOARD.QUESTION.STATISTICS]: {
        parentId: "question-game-management",
        subId: "question-statistics",
      },
      [ROUTES.ADMIN_DASHBOARD.STATISTICS.OVERVIEW]: {
        parentId: "statistics-reports",
        subId: "statistics-overview",
      },
      [ROUTES.ADMIN_DASHBOARD.STATISTICS.USER]: {
        parentId: "statistics-reports",
        subId: "statistics-user",
      },
      [ROUTES.ADMIN_DASHBOARD.SYSTEM.RELEASE_DATE]: {
        parentId: "system-config",
        subId: "release-date",
      },
      [ROUTES.ADMIN_DASHBOARD.LIBRARY.CARD]: {
        parentId: "manage-library",
        subId: "card",
      },
      [ROUTES.ADMIN_DASHBOARD.LIBRARY.CARD_STORY]: {
        parentId: "manage-library",
        subId: "card-story",
      },
      [ROUTES.ADMIN_DASHBOARD.LIBRARY.LIB_CARD]: {
        parentId: "manage-library",
        subId: "lib-card",
      },
      [ROUTES.ADMIN_DASHBOARD.LIBRARY.KY_NHAN_LIST]: {
        parentId: "manage-library",
        subId: "ky-nhan-list",
      },
      [ROUTES.ADMIN_DASHBOARD.LIBRARY.KY_NHAN_SUMMARY]: {
        parentId: "manage-library",
        subId: "ky-nhan-summary",
      },
    }),
    []
  );

  useEffect(() => {
    if (!pathname) return;
    const match = ROUTE_TO_ACTIVE_STATE[pathname];
    if (!match) return;

    setActiveItem(match.parentId);
    setActiveSubItem(match.subId ?? "");
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      next.add(match.parentId);
      return next;
    });
  }, [pathname, ROUTE_TO_ACTIVE_STATE]);

  const [activeItem, setActiveItem] = useState<string>(INITIAL_ACTIVE_ITEM);
  const [activeSubItem, setActiveSubItem] = useState<string>("");
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(
    INITIAL_EXPANDED_MENUS
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Memoized handlers
  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  }, []);

  const handleItemClick = useCallback(
    (item: IPAGES.MenuItem) => {
      if (item.subItems) {
        toggleMenu(item.id);
        // Nếu có sub-items, set active item cha và clear sub-item
        setActiveItem(item.id);
        setActiveSubItem("");
      } else {
        // Nếu không có sub-items, set active item và clear sub-item
        setActiveItem(item.id);
        setActiveSubItem("");
        const target = MAINITEM_ROUTE_MAP[item.id];
        if (target) {
          router.push(target);
        }
      }
    },
    [toggleMenu, MAINITEM_ROUTE_MAP, router]
  );

  const handleSubItemClick = useCallback(
    (subItemId: string, parentItemId: string) => {
      setActiveSubItem(subItemId);
      setActiveItem(parentItemId);
      const target = SUBITEM_ROUTE_MAP[subItemId];
      if (target) {
        router.push(target);
      }
    },
    [SUBITEM_ROUTE_MAP, router]
  );

  const toggleCollapse = useCallback(() => {
    setIsTransitioning(true);
    setIsCollapsed((prev) => !prev);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Style generators
  const getItemStyles = useCallback(
    (item: IPAGES.MenuItem, isSubItem = false): IPAGES.MenuItemStyles => {
      const isActive = isSubItem
        ? activeSubItem === item.id
        : activeItem === item.id;

      if (!isActive) return STYLES.inactive;

      return isSubItem ? STYLES.primary : STYLES.secondary;
    },
    [activeItem, activeSubItem]
  );

  const getIconColor = useCallback(
    (item: IPAGES.MenuItem, isSubItem = false): string => {
      const isActive = isSubItem
        ? activeSubItem === item.id
        : activeItem === item.id;
      return isActive ? COLORS.TEXT.LIGHT : COLORS.TEXT.DARK;
    },
    [activeItem, activeSubItem]
  );

  // Memoized components
  const MenuIcon = useCallback(
    ({
      name,
      size,
      color,
    }: {
      name: IPAGES.LucideIconName;
      size: number;
      color: string;
    }) => <LucideIcon name={name} iconSize={size} iconColor={color} />,
    []
  );

  const SubMenuItem = useCallback(
    ({
      subItem,
      parentItemId,
    }: {
      subItem: IPAGES.SubMenuItem;
      parentItemId: string;
    }) => (
      <Button
        variant="ghost"
        className={BUTTON_CLASSES.subItem}
        style={getItemStyles(subItem as IPAGES.MenuItem, true)}
        onClick={() => handleSubItemClick(subItem.id, parentItemId)}
        title={isCollapsed ? subItem.label : undefined}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0">
            <MenuIcon
              name={subItem.icon}
              size={16}
              color={getIconColor(subItem as IPAGES.MenuItem, true)}
            />
          </div>
          {!isCollapsed && !isTransitioning && (
            <span className="text-xs font-medium text-left leading-relaxed">
              {subItem.label}
            </span>
          )}
        </div>
      </Button>
    ),
    [
      getItemStyles,
      getIconColor,
      handleSubItemClick,
      MenuIcon,
      isCollapsed,
      isTransitioning,
    ]
  );

  const MainMenuItem = useCallback(
    ({ item }: { item: IPAGES.MenuItem }) => (
      <Button
        variant="ghost"
        className={BUTTON_CLASSES.mainItem}
        style={getItemStyles(item)}
        onClick={() => handleItemClick(item)}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0">
            <MenuIcon name={item.icon} size={20} color={getIconColor(item)} />
          </div>
          {!isCollapsed && !isTransitioning && (
            <>
              <span className="text-sm font-medium text-left leading-relaxed flex-1">
                {item.label}
              </span>
              {item.subItems && (
                <MenuIcon
                  name={
                    expandedMenus.has(item.id) ? "ChevronUp" : "ChevronDown"
                  }
                  size={16}
                  color={getIconColor(item)}
                />
              )}
            </>
          )}
        </div>
      </Button>
    ),
    [
      getItemStyles,
      getIconColor,
      handleItemClick,
      expandedMenus,
      MenuIcon,
      isCollapsed,
      isTransitioning,
    ]
  );

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${SIDEBAR_CLASSES.container}
          ${isCollapsed ? SIDEBAR_CLASSES.collapsed : SIDEBAR_CLASSES.expanded}
          ${isMobileMenuOpen ? SIDEBAR_CLASSES.mobile : ""}
          ${SIDEBAR_CLASSES.desktop}
          bg-admin-primary  border-r border-gray-300
        `}
      >
        {/* Header */}
        <header className={`${isCollapsed ? "mb-4" : "mb-4"}`}>
          <div
            className={`border-b border-gray-300 ${isCollapsed ? "pt-2 -mx-2 pb-5" : "-mx-6 pb-3"
              }`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-6"
                }`}
            >
              {(!isCollapsed || isMobileMenuOpen) && !isTransitioning && (
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={BUTTON_CLASSES.collapse}
                  onClick={toggleCollapse}
                  title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                  <MenuIcon name="Menu" size={18} color={COLORS.TEXT.DARK} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-3 flex-1 pt-2 overflow-y-auto custom-scrollbar-thin">
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col">
              <MainMenuItem item={item} />

              {/* Sub Menu Items */}
              {(!isCollapsed || isMobileMenuOpen) &&
                !isTransitioning &&
                item.subItems &&
                expandedMenus.has(item.id) && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <SubMenuItem
                        key={subItem.id}
                        subItem={subItem}
                        parentItemId={item.id}
                      />
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSideBar;
