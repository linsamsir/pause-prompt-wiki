export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh";

type Dict = {
  nav: {
    home: string;
    wiki: string;
    builder: string;
    random: string;
    leaderboard: string;
    admin: string;
    login: string;
    logout: string;
    account: string;
  };
  common: {
    search: string;
    filter: string;
    all: string;
    sfw: string;
    nsfw: string;
    showNsfw: string;
    language: string;
    copy: string;
    copied: string;
    like: string;
    favorite: string;
    views: string;
    author: string;
    submit: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    required: string;
    empty: string;
    loading: string;
    readMore: string;
    back: string;
    trending: string;
    newest: string;
    mostLiked: string;
    mostFavorited: string;
    supportUs: string;
    supportUsShort: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroCtaBuilder: string;
    heroCtaRandom: string;
    hotPrompts: string;
    hotPromptsSub: string;
    categories: string;
    stats: string;
    totalPrompts: string;
    totalUsers: string;
    totalLikes: string;
    leaderboardCta: string;
    leaderboardSub: string;
  };
  wiki: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResults: string;
    usePrompt: string;
    detailAuthor: string;
    detailCategory: string;
    detailTags: string;
    detailModel: string;
    detailNegative: string;
    detailParameters: string;
    detailCreated: string;
  };
  builder: {
    title: string;
    subtitle: string;
    preview: string;
    generate: string;
    clear: string;
    copyPrompt: string;
    saveToWiki: string;
  };
  random: {
    title: string;
    subtitle: string;
    roll: string;
    rerollHint: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    byLikes: string;
    byFavorites: string;
    rank: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    sendLink: string;
    checkEmail: string;
    error: string;
    redirectNotice: string;
    ageNotice: string;
  };
  account: {
    menuTitle: string;
    profile: string;
    favorites: string;
    admin: string;
    signOut: string;
    signingOut: string;
  };
  age: {
    title: string;
    body: string;
    checkbox: string;
    confirm: string;
    reject: string;
    requireCheck: string;
    error: string;
  };
  auth: {
    loginRequiredLike: string;
    loginRequiredFavorite: string;
    loginRequiredNsfw: string;
  };
  admin: {
    title: string;
    prompts: string;
    categories: string;
    elements: string;
    stats: string;
  };
};

export const dict: Record<Locale, Dict> = {
  zh: {
    nav: {
      home: "首頁",
      wiki: "Prompt Wiki",
      builder: "組裝器",
      random: "隨機",
      leaderboard: "排行榜",
      admin: "管理",
      login: "登入",
      logout: "登出",
      account: "帳戶",
    },
    common: {
      search: "搜尋",
      filter: "篩選",
      all: "全部",
      sfw: "安全",
      nsfw: "R-18",
      showNsfw: "顯示 NSFW",
      language: "語言",
      copy: "複製",
      copied: "已複製",
      like: "按讚",
      favorite: "收藏",
      views: "瀏覽",
      author: "作者",
      submit: "送出",
      save: "儲存",
      cancel: "取消",
      delete: "刪除",
      edit: "編輯",
      create: "新增",
      required: "必填",
      empty: "沒有資料",
      loading: "載入中",
      readMore: "閱讀更多",
      back: "返回",
      trending: "熱門",
      newest: "最新",
      mostLiked: "最多讚",
      mostFavorited: "最多收藏",
      supportUs: "支持創作 ☕",
      supportUsShort: "請喝咖啡",
    },
    home: {
      heroTitle: "把靈感整理成可重複使用的 Prompt",
      heroSubtitle:
        "收錄、分類、組裝與隨機生成 AI 提示詞的圖書館，讓每次生成不只是碰運氣。",
      heroCta: "瀏覽 Prompt Wiki",
      heroCtaBuilder: "開始組裝",
      heroCtaRandom: "隨機抽 Prompt",
      hotPrompts: "熱門提示",
      hotPromptsSub: "最多人收藏與按讚的 prompt 靈感",
      categories: "分類",
      stats: "社群統計",
      totalPrompts: "總提示詞",
      totalUsers: "註冊用戶",
      totalLikes: "累積按讚",
      leaderboardCta: "看看本週冠軍 Prompt",
      leaderboardSub: "從社群最喜歡的提示詞中，找到下一次生成的方向。",
    },
    wiki: {
      title: "Prompt Wiki",
      subtitle: "收錄社群精選提示詞，依分類、模型、標籤檢索。",
      searchPlaceholder: "搜尋提示詞、標籤、作者…",
      noResults: "沒有符合條件的提示詞。",
      usePrompt: "使用此 Prompt",
      detailAuthor: "作者",
      detailCategory: "分類",
      detailTags: "標籤",
      detailModel: "模型",
      detailNegative: "反向詞",
      detailParameters: "參數",
      detailCreated: "建立時間",
    },
    builder: {
      title: "Prompt 組裝器",
      subtitle: "從主體、場景、光線、鏡頭、風格、品質、反向詞依序堆疊。",
      preview: "即時預覽",
      generate: "產生",
      clear: "清空",
      copyPrompt: "複製 Prompt",
      saveToWiki: "收錄到 Wiki",
    },
    random: {
      title: "隨機 Prompt",
      subtitle: "一期一會：讓系統為你擲出一段提示詞。",
      roll: "擲骰",
      rerollHint: "再按一次試試別的。",
    },
    leaderboard: {
      title: "排行榜",
      subtitle: "社群最受喜愛的 Prompt。",
      byLikes: "按讚數排行",
      byFavorites: "收藏數排行",
      rank: "名次",
    },
    login: {
      title: "登入 / 註冊",
      subtitle: "輸入信箱取得 Magic Link，無需密碼。",
      emailPlaceholder: "your@email.com",
      sendLink: "寄送登入連結",
      checkEmail: "請檢查信箱並點擊連結完成登入。",
      error: "寄送失敗，請稍後再試。",
      redirectNotice: "登入完成後將回到你剛才所在的頁面。",
      ageNotice: "若要瀏覽成人內容，需先登入並完成年齡確認。",
    },
    account: {
      menuTitle: "帳戶",
      profile: "個人頁面",
      favorites: "我的收藏",
      admin: "管理後台",
      signOut: "登出",
      signingOut: "登出中…",
    },
    age: {
      title: "年齡確認",
      body: "本站部分內容為成人限定，請確認您已年滿 18 歲。",
      checkbox: "我確認我已年滿 18 歲，並自願觀看成人內容",
      confirm: "確認進入",
      reject: "我改變主意",
      requireCheck: "請先勾選同意欄位。",
      error: "寫入年齡確認失敗，請稍後再試。",
    },
    auth: {
      loginRequiredLike: "登入後才能按讚，將帶你前往登入。",
      loginRequiredFavorite: "登入後才能收藏，將帶你前往登入。",
      loginRequiredNsfw: "觀看成人內容需先登入。",
    },
    admin: {
      title: "管理後台",
      prompts: "Prompt",
      categories: "分類",
      elements: "Builder 元素",
      stats: "統計",
    },
  },
  en: {
    nav: {
      home: "Home",
      wiki: "Wiki",
      builder: "Builder",
      random: "Random",
      leaderboard: "Leaderboard",
      admin: "Admin",
      login: "Sign in",
      logout: "Sign out",
      account: "Account",
    },
    common: {
      search: "Search",
      filter: "Filter",
      all: "All",
      sfw: "SFW",
      nsfw: "NSFW",
      showNsfw: "Show NSFW",
      language: "Language",
      copy: "Copy",
      copied: "Copied",
      like: "Like",
      favorite: "Favorite",
      views: "Views",
      author: "Author",
      submit: "Submit",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      required: "Required",
      empty: "No data",
      loading: "Loading",
      readMore: "Read more",
      back: "Back",
      trending: "Trending",
      newest: "Newest",
      mostLiked: "Most liked",
      mostFavorited: "Most favorited",
      supportUs: "Support Us ☕",
      supportUsShort: "Buy me a coffee",
    },
    home: {
      heroTitle: "Turn Inspiration into Reusable Prompts",
      heroSubtitle:
        "A library to collect, organize, build, and randomly generate AI prompts — so every generation has a reason.",
      heroCta: "Browse the Wiki",
      heroCtaBuilder: "Open Builder",
      heroCtaRandom: "Random Prompt",
      hotPrompts: "Hot prompts",
      hotPromptsSub: "Most liked and saved prompts by the community",
      categories: "Categories",
      stats: "Community stats",
      totalPrompts: "Prompts",
      totalUsers: "Members",
      totalLikes: "Likes",
      leaderboardCta: "This Week's Top Prompts",
      leaderboardSub:
        "Find your next generation idea from the community's favorites.",
    },
    wiki: {
      title: "Prompt Wiki",
      subtitle:
        "Community-curated prompts — browse by category, model, and tag.",
      searchPlaceholder: "Search prompts, tags, authors…",
      noResults: "No prompts matched your filter.",
      usePrompt: "Use this prompt",
      detailAuthor: "Author",
      detailCategory: "Category",
      detailTags: "Tags",
      detailModel: "Model",
      detailNegative: "Negative",
      detailParameters: "Parameters",
      detailCreated: "Created",
    },
    builder: {
      title: "Prompt Builder",
      subtitle: "Compose from subject, scene, lighting, camera, style, quality, negative.",
      preview: "Live preview",
      generate: "Generate",
      clear: "Clear",
      copyPrompt: "Copy prompt",
      saveToWiki: "Save to Wiki",
    },
    random: {
      title: "Random Prompt",
      subtitle: "Ichi-go ichi-e — let the system roll one for you.",
      roll: "Roll",
      rerollHint: "Hit it again for another.",
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "Community favorites.",
      byLikes: "By likes",
      byFavorites: "By favorites",
      rank: "Rank",
    },
    login: {
      title: "Sign in",
      subtitle: "Enter your email for a magic link — no password required.",
      emailPlaceholder: "you@email.com",
      sendLink: "Send magic link",
      checkEmail: "Check your email for the sign-in link.",
      error: "Failed to send. Please try again.",
      redirectNotice: "You'll be taken back to where you were after sign-in.",
      ageNotice:
        "Viewing adult content requires signing in and verifying your age.",
    },
    account: {
      menuTitle: "Account",
      profile: "Profile",
      favorites: "My favorites",
      admin: "Admin",
      signOut: "Sign out",
      signingOut: "Signing out…",
    },
    age: {
      title: "Age verification",
      body: "Parts of this site contain adult content. Please confirm you are at least 18 years old.",
      checkbox: "I confirm I am at least 18 and wish to view adult content",
      confirm: "Confirm and enter",
      reject: "Never mind",
      requireCheck: "Please check the box to continue.",
      error: "Could not save your confirmation. Please try again.",
    },
    auth: {
      loginRequiredLike: "Sign in to like — taking you to login.",
      loginRequiredFavorite: "Sign in to save — taking you to login.",
      loginRequiredNsfw: "Sign in to view adult content.",
    },
    admin: {
      title: "Admin",
      prompts: "Prompts",
      categories: "Categories",
      elements: "Builder elements",
      stats: "Stats",
    },
  },
};
