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
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginCta: string;
    signingIn: string;
    sendLink: string;
    checkEmail: string;
    error: string;
    invalidCredentials: string;
    needsConfirmation: string;
    redirectNotice: string;
    ageNotice: string;
    or: string;
    useMagicLinkInstead: string;
    usePasswordInstead: string;
    noAccount: string;
    registerCta: string;
    forgotPassword: string;
  };
  register: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    confirmLabel: string;
    birthDateLabel: string;
    birthDateHint: string;
    cta: string;
    submitting: string;
    success: string;
    passwordTooShort: string;
    passwordMismatch: string;
    emailInUse: string;
    error: string;
    haveAccount: string;
    loginCta: string;
  };
  profile: {
    title: string;
    subtitle: string;
    basicInfo: string;
    displayNameLabel: string;
    usernameLabel: string;
    birthDateLabel: string;
    emailLabel: string;
    save: string;
    saving: string;
    saved: string;
    usernameTaken: string;
    saveError: string;
    tabPrompts: string;
    tabFavorites: string;
    emptyPrompts: string;
    emptyFavorites: string;
    contentPrefs: string;
    nsfwVerified: string;
    nsfwVerifyCta: string;
    nsfwDesc: string;
    dangerZone: string;
    changePasswordTitle: string;
    changePasswordCta: string;
    changePasswordCurrent: string;
    changePasswordNew: string;
    changePasswordConfirm: string;
    changePasswordSubmit: string;
    changePasswordSuccess: string;
    changePasswordMismatch: string;
    changePasswordTooShort: string;
    changePasswordError: string;
    deleteTitle: string;
    deleteDesc: string;
    deleteConfirmHint: string;
    deleteConfirmLabel: string;
    deleteCta: string;
    deleteSubmitting: string;
    deleteError: string;
    adminBadge: string;
    verifiedBadge: string;
  };
  account: {
    menuTitle: string;
    profile: string;
    favorites: string;
    admin: string;
    submit: string;
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
  forgot: {
    title: string;
    subtitle: string;
    emailLabel: string;
    cta: string;
    submitting: string;
    sent: string;
    error: string;
    backToLogin: string;
  };
  reset: {
    title: string;
    subtitle: string;
    newPassword: string;
    confirmPassword: string;
    cta: string;
    submitting: string;
    success: string;
    mismatch: string;
    tooShort: string;
    error: string;
    noSession: string;
  };
  uploader: {
    label: string;
    hint: string;
    addImage: string;
    uploading: string;
    remove: string;
    tooLarge: string;
    badType: string;
    uploadFailed: string;
    maxReached: string;
  };
  edit: {
    title: string;
    subtitle: string;
    save: string;
    saving: string;
    success: string;
    error: string;
    delete: string;
    deleting: string;
    deleteConfirm: string;
    deleteError: string;
    publishLabel: string;
    publishHint: string;
    cta: string;
  };
  submit: {
    title: string;
    subtitle: string;
    fieldTitleZh: string;
    fieldTitleEn: string;
    fieldDescZh: string;
    fieldDescEn: string;
    fieldBody: string;
    fieldBodyHint: string;
    fieldNegative: string;
    fieldParameters: string;
    fieldModel: string;
    fieldTags: string;
    fieldTagsHint: string;
    fieldCategory: string;
    fieldCategoryNone: string;
    fieldSlug: string;
    fieldSlugHint: string;
    fieldNsfw: string;
    fieldNsfwHint: string;
    cta: string;
    submitting: string;
    success: string;
    error: string;
    draftNotice: string;
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
      title: "登入",
      subtitle: "使用信箱與密碼登入；首次造訪請先註冊。",
      emailLabel: "信箱",
      emailPlaceholder: "your@email.com",
      passwordLabel: "密碼",
      passwordPlaceholder: "輸入密碼",
      loginCta: "登入",
      signingIn: "登入中…",
      sendLink: "寄送 Magic Link",
      checkEmail: "請檢查信箱並點擊連結完成登入。",
      error: "登入失敗，請稍後再試。",
      invalidCredentials: "信箱或密碼錯誤。",
      needsConfirmation: "請先點擊信箱內的驗證連結才能登入。",
      redirectNotice: "登入完成後將回到你剛才所在的頁面。",
      ageNotice: "若要瀏覽成人內容，需先登入並完成年齡確認。",
      or: "或",
      useMagicLinkInstead: "改用 Magic Link 登入",
      usePasswordInstead: "改用密碼登入",
      noAccount: "還沒有帳號？",
      registerCta: "前往註冊",
      forgotPassword: "忘記密碼？",
    },
    register: {
      title: "註冊",
      subtitle: "建立新帳號，即可收藏、按讚、發表 Prompt。",
      emailLabel: "信箱",
      passwordLabel: "密碼",
      passwordHint: "至少 6 個字元。",
      confirmLabel: "再次輸入密碼",
      birthDateLabel: "出生年月日（選填）",
      birthDateHint: "用來確認年齡；不會公開顯示。",
      cta: "建立帳號",
      submitting: "建立中…",
      success: "註冊成功，請至信箱完成驗證後再登入。",
      passwordTooShort: "密碼至少需要 6 個字元。",
      passwordMismatch: "兩次輸入的密碼不一致。",
      emailInUse: "此信箱已被註冊，請直接登入。",
      error: "註冊失敗，請稍後再試。",
      haveAccount: "已經有帳號？",
      loginCta: "直接登入",
    },
    profile: {
      title: "個人資料",
      subtitle: "管理你的帳號資訊、作品與偏好設定。",
      basicInfo: "基本資料",
      displayNameLabel: "顯示名稱",
      usernameLabel: "使用者名稱",
      birthDateLabel: "出生年月日",
      emailLabel: "信箱",
      save: "儲存",
      saving: "儲存中…",
      saved: "已儲存",
      usernameTaken: "此使用者名稱已被使用。",
      saveError: "儲存失敗：",
      tabPrompts: "我的 Prompt",
      tabFavorites: "我的收藏",
      emptyPrompts: "還沒有發表過 Prompt。",
      emptyFavorites: "還沒有收藏任何 Prompt。",
      contentPrefs: "內容偏好",
      nsfwVerified: "已完成 18+ 驗證",
      nsfwVerifyCta: "進行年齡驗證",
      nsfwDesc: "驗證 18 歲以上，才能在 header 啟用 NSFW 顯示。",
      dangerZone: "危險區",
      changePasswordTitle: "變更密碼",
      changePasswordCta: "變更密碼",
      changePasswordCurrent: "目前密碼（可略）",
      changePasswordNew: "新密碼",
      changePasswordConfirm: "再次輸入新密碼",
      changePasswordSubmit: "更新密碼",
      changePasswordSuccess: "密碼已更新。",
      changePasswordMismatch: "兩次輸入不一致。",
      changePasswordTooShort: "至少 6 個字元。",
      changePasswordError: "更新失敗：",
      deleteTitle: "刪除帳號",
      deleteDesc: "此動作無法復原。你的 Prompt、收藏、按讚都會一併刪除。",
      deleteConfirmHint: "請輸入你的信箱以確認：",
      deleteConfirmLabel: "信箱",
      deleteCta: "永久刪除帳號",
      deleteSubmitting: "刪除中…",
      deleteError: "刪除失敗：",
      adminBadge: "管理員",
      verifiedBadge: "18+",
    },
    account: {
      menuTitle: "帳戶",
      profile: "個人頁面",
      favorites: "我的收藏",
      admin: "管理後台",
      submit: "投稿 Prompt",
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
    forgot: {
      title: "忘記密碼",
      subtitle: "輸入你的信箱，我們會寄一封密碼重設信給你。",
      emailLabel: "信箱",
      cta: "寄送重設連結",
      submitting: "寄送中…",
      sent: "已寄出。請到信箱點擊連結設定新密碼。",
      error: "寄送失敗，請稍後再試。",
      backToLogin: "回到登入頁",
    },
    reset: {
      title: "重設密碼",
      subtitle: "設定新密碼，完成後會直接登入。",
      newPassword: "新密碼",
      confirmPassword: "再次輸入新密碼",
      cta: "更新密碼",
      submitting: "更新中…",
      success: "密碼已更新，正在進入帳戶…",
      mismatch: "兩次輸入不一致。",
      tooShort: "密碼至少 6 個字元。",
      error: "更新失敗：",
      noSession: "重設連結已失效，請重新寄送。",
    },
    edit: {
      title: "編輯 Prompt",
      subtitle: "修改現有 Prompt；管理員可切換發佈狀態。",
      save: "儲存變更",
      saving: "儲存中…",
      success: "已儲存",
      error: "更新失敗：",
      delete: "刪除",
      deleting: "刪除中…",
      deleteConfirm: "確定要刪除這個 Prompt？此動作無法復原（連同收藏與按讚紀錄都會清除）。",
      deleteError: "刪除失敗：",
      publishLabel: "已發佈",
      publishHint: "勾選後此 Prompt 對所有人可見；取消勾選會回到草稿狀態。",
      cta: "編輯",
    },
    uploader: {
      label: "成果圖（選填）",
      hint: "拖曳或點選上傳；最多 4 張、每張 ≤ 5MB；JPG / PNG / WEBP / GIF",
      addImage: "新增圖片",
      uploading: "上傳中…",
      remove: "移除",
      tooLarge: "檔案太大（>5MB）：",
      badType: "格式不支援：",
      uploadFailed: "上傳失敗：",
      maxReached: "最多 4 張",
    },
    submit: {
      title: "投稿 Prompt",
      subtitle: "你的作品會以草稿儲存，管理員審核後就會上架。",
      fieldTitleZh: "標題（中）",
      fieldTitleEn: "Title（英，選填）",
      fieldDescZh: "描述（中）",
      fieldDescEn: "Description（英，選填）",
      fieldBody: "Prompt 內容",
      fieldBodyHint: "完整提示詞。這是最重要的欄位。",
      fieldNegative: "反向詞（選填）",
      fieldParameters: "參數（選填）",
      fieldModel: "模型（選填，如 SDXL / Flux / Midjourney）",
      fieldTags: "標籤（以逗號分隔，選填）",
      fieldTagsHint: "例如：japan, night, moody",
      fieldCategory: "分類",
      fieldCategoryNone: "— 無 —",
      fieldSlug: "Slug（選填）",
      fieldSlugHint: "留空會由標題自動產生。",
      fieldNsfw: "成人內容",
      fieldNsfwHint: "勾選後此 prompt 只會對完成年齡驗證的使用者顯示。",
      cta: "送出投稿",
      submitting: "送出中…",
      success: "投稿成功！你可以在個人資料的「我的 Prompt」看到這份草稿。",
      error: "投稿失敗：",
      draftNotice: "此投稿會先以草稿狀態存檔，管理員審核通過後才會對外顯示。",
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
      subtitle: "Use your email and password. First time here? Register below.",
      emailLabel: "Email",
      emailPlaceholder: "you@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Your password",
      loginCta: "Sign in",
      signingIn: "Signing in…",
      sendLink: "Send magic link",
      checkEmail: "Check your email for the sign-in link.",
      error: "Sign-in failed. Please try again.",
      invalidCredentials: "Invalid email or password.",
      needsConfirmation: "Please confirm your email first — check your inbox.",
      redirectNotice: "You'll be taken back to where you were after sign-in.",
      ageNotice:
        "Viewing adult content requires signing in and verifying your age.",
      or: "or",
      useMagicLinkInstead: "Use magic link instead",
      usePasswordInstead: "Use password instead",
      noAccount: "No account yet?",
      registerCta: "Create one",
      forgotPassword: "Forgot password?",
    },
    register: {
      title: "Create account",
      subtitle: "Sign up to like, save, and publish prompts.",
      emailLabel: "Email",
      passwordLabel: "Password",
      passwordHint: "At least 6 characters.",
      confirmLabel: "Confirm password",
      birthDateLabel: "Date of birth (optional)",
      birthDateHint: "Used for age verification; never shown publicly.",
      cta: "Create account",
      submitting: "Creating…",
      success:
        "Account created — check your inbox for the verification link before signing in.",
      passwordTooShort: "Password must be at least 6 characters.",
      passwordMismatch: "Passwords do not match.",
      emailInUse: "That email is already registered. Please sign in instead.",
      error: "Sign-up failed. Please try again.",
      haveAccount: "Already have an account?",
      loginCta: "Sign in",
    },
    profile: {
      title: "Profile",
      subtitle: "Manage your account, work, and preferences.",
      basicInfo: "Basic info",
      displayNameLabel: "Display name",
      usernameLabel: "Username",
      birthDateLabel: "Date of birth",
      emailLabel: "Email",
      save: "Save",
      saving: "Saving…",
      saved: "Saved",
      usernameTaken: "Username already taken.",
      saveError: "Save failed: ",
      tabPrompts: "My Prompts",
      tabFavorites: "My Favorites",
      emptyPrompts: "No prompts published yet.",
      emptyFavorites: "No favorites saved yet.",
      contentPrefs: "Content preferences",
      nsfwVerified: "18+ verified",
      nsfwVerifyCta: "Verify age",
      nsfwDesc: "Verify 18+ to enable the NSFW toggle in the header.",
      dangerZone: "Danger zone",
      changePasswordTitle: "Change password",
      changePasswordCta: "Change password",
      changePasswordCurrent: "Current password (optional)",
      changePasswordNew: "New password",
      changePasswordConfirm: "Confirm new password",
      changePasswordSubmit: "Update password",
      changePasswordSuccess: "Password updated.",
      changePasswordMismatch: "Passwords do not match.",
      changePasswordTooShort: "At least 6 characters.",
      changePasswordError: "Update failed: ",
      deleteTitle: "Delete account",
      deleteDesc:
        "This cannot be undone. Your prompts, favorites, and likes will all be removed.",
      deleteConfirmHint: "Type your email to confirm:",
      deleteConfirmLabel: "Email",
      deleteCta: "Permanently delete account",
      deleteSubmitting: "Deleting…",
      deleteError: "Delete failed: ",
      adminBadge: "Admin",
      verifiedBadge: "18+",
    },
    account: {
      menuTitle: "Account",
      profile: "Profile",
      favorites: "My favorites",
      admin: "Admin",
      submit: "Submit a prompt",
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
    forgot: {
      title: "Forgot password",
      subtitle: "Enter your email and we'll send you a password reset link.",
      emailLabel: "Email",
      cta: "Send reset link",
      submitting: "Sending…",
      sent: "Sent. Check your inbox and follow the link to set a new password.",
      error: "Failed to send. Please try again.",
      backToLogin: "Back to sign in",
    },
    reset: {
      title: "Reset password",
      subtitle: "Set a new password — you'll be signed in right after.",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      cta: "Update password",
      submitting: "Updating…",
      success: "Password updated — signing you in…",
      mismatch: "Passwords do not match.",
      tooShort: "Password must be at least 6 characters.",
      error: "Update failed: ",
      noSession: "This reset link has expired. Please request a new one.",
    },
    edit: {
      title: "Edit prompt",
      subtitle: "Update an existing prompt; admins can also toggle publish state.",
      save: "Save changes",
      saving: "Saving…",
      success: "Saved",
      error: "Update failed: ",
      delete: "Delete",
      deleting: "Deleting…",
      deleteConfirm:
        "Delete this prompt? This cannot be undone — likes and favorites will be removed too.",
      deleteError: "Delete failed: ",
      publishLabel: "Published",
      publishHint:
        "When checked, this prompt is visible to everyone. Uncheck to return it to draft.",
      cta: "Edit",
    },
    uploader: {
      label: "Result images (optional)",
      hint: "Drop or click to upload — up to 4 images, ≤ 5MB each, JPG / PNG / WEBP / GIF",
      addImage: "Add image",
      uploading: "Uploading…",
      remove: "Remove",
      tooLarge: "File too large (>5MB): ",
      badType: "Unsupported format: ",
      uploadFailed: "Upload failed: ",
      maxReached: "Max 4 images",
    },
    submit: {
      title: "Submit a prompt",
      subtitle: "Your submission is saved as a draft; an admin will review and publish.",
      fieldTitleZh: "Title (zh)",
      fieldTitleEn: "Title (en, optional)",
      fieldDescZh: "Description (zh)",
      fieldDescEn: "Description (en, optional)",
      fieldBody: "Prompt body",
      fieldBodyHint: "The full prompt text. This is the most important field.",
      fieldNegative: "Negative (optional)",
      fieldParameters: "Parameters (optional)",
      fieldModel: "Model (optional — e.g. SDXL, Flux, Midjourney)",
      fieldTags: "Tags (comma-separated, optional)",
      fieldTagsHint: "e.g. japan, night, moody",
      fieldCategory: "Category",
      fieldCategoryNone: "— none —",
      fieldSlug: "Slug (optional)",
      fieldSlugHint: "Leave blank to auto-generate from title.",
      fieldNsfw: "NSFW",
      fieldNsfwHint:
        "When checked, this prompt is visible only to viewers who've verified they are 18+.",
      cta: "Submit",
      submitting: "Submitting…",
      success:
        "Submitted! You'll find this draft under 'My Prompts' in your profile.",
      error: "Submit failed: ",
      draftNotice:
        "Submissions are saved as drafts and go live after admin review.",
    },
  },
};
