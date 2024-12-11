/** Default theme settings */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: "auto",
  themeColor: "#22c55e",
  otherColor: {info: "#2080f0", success: "#52c41a", warning: "#faad14", error: "#f5222d"},
  isInfoFollowPrimary: true,
  layout: {mode: "horizontal-mix", scrollMode: "wrapper"},
  page: {animate: true, animateMode: "fade"},
  header: {height: 41, breadcrumb: {visible: true, showIcon: true}},
  tab: {visible: true, cache: true, height: 50, mode: "button"},
  fixedHeaderAndTab: true,
  sider: {inverted: true, width: 220, collapsedWidth: 64, mixWidth: 90, mixCollapsedWidth: 64, mixChildMenuWidth: 120},
  footer: {visible: true, fixed: false, height: 50, right: true}
}

/**
 * Override theme settings
 *
 * If publish new version, use `overrideThemeSettings` to override certain theme settings
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {};
