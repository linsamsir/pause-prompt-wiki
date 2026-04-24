-- =====================================================================
-- Pause Prompt Wiki — seed data (run AFTER schema.sql)
-- 注意：profiles.id 必須對應 auth.users 中存在的 user。
--      所以這份 seed 僅塞 categories / prompts / builder_elements，
--      prompts.author_id 預設為 null。要指定作者，先註冊一位使用者
--      再執行：update public.profiles set display_name='...', is_admin=true where id='<uid>';
-- =====================================================================

-- categories ----------------------------------------------------------
insert into public.categories (slug, name_zh, name_en, description_zh, description_en, "order") values
 ('portrait',  '人物',    'Portrait',   '角色、肖像、人設', 'Characters, portraits, personas',              0),
 ('landscape', '風景',    'Landscape',  '自然與城市風景',    'Nature and cityscapes',                         1),
 ('anime',     '動漫',    'Anime',      '日系動漫畫風',      'Japanese anime and manga styles',               2),
 ('cinematic', '電影感',  'Cinematic',  '電影光影與構圖',    'Film stills and cinematic framing',             3),
 ('macro',     '微距',    'Macro',      '近攝與細節',        'Macro and close-up photography',                4),
 ('abstract',  '抽象',    'Abstract',   '非具象與實驗',      'Non-figurative & experimental',                 5),
 ('nsfw',      '成人',    'NSFW',       '僅供成人觀賞',      'Adult content',                                 9)
on conflict (slug) do update set
  name_zh = excluded.name_zh,
  name_en = excluded.name_en,
  description_zh = excluded.description_zh,
  description_en = excluded.description_en,
  "order" = excluded."order";

-- prompts -------------------------------------------------------------
with cats as (
  select slug, id from public.categories
)
insert into public.prompts (
  slug, title_zh, title_en, description_zh, description_en,
  body, negative, parameters, model, tags,
  category_id, is_nsfw, is_published, likes_count, favorites_count, views_count
)
select * from (values
  ('kyoto-alley-rain',
   '京都雨夜小巷', 'Kyoto Alley in the Rain',
   '雨後的祇園小巷，紙傘下的孤影與石板路光澤。',
   'Gion alley after rain: a lone figure under a paper umbrella, wet cobblestones glinting.',
   'a lone woman in a deep red kimono walking down a narrow kyoto alley at night, wet stone pavement reflecting paper lanterns, cinematic rim light, bokeh, 35mm, film grain, moody color grading',
   'blurry, low quality, deformed hands, extra fingers, watermark',
   '--ar 3:2 --style raw',
   'SDXL',
   array['japan','night','moody','rain','cinematic'],
   (select id from cats where slug = 'cinematic'),
   false, true, 128, 42, 0),

  ('ghibli-meadow',
   '青草地上的少女', 'Girl in the Meadow',
   '宮崎駿風格手繪感的夏日原野。',
   'Miyazaki-inspired hand-drawn meadow under summer light.',
   'a young girl with short black hair running through a sunlit meadow, hand painted anime style, ghibli-inspired, soft pastel color palette, cumulus clouds, 2d flat shading',
   'photo, realistic, 3d, low detail, distorted',
   null,
   'SDXL',
   array['ghibli','anime','summer','pastoral'],
   (select id from cats where slug = 'anime'),
   false, true, 342, 98, 0),

  ('lone-noren',
   '暖簾之門', 'Shop Noren',
   '木造老屋入口、靛藍暖簾隨風微擺。',
   'Wooden storefront with an indigo noren gently swaying.',
   'close-up of an indigo noren curtain hanging at the entrance of an old wooden tea shop in kanazawa, afternoon side light, shallow depth of field, 50mm, muted earth tones',
   'cartoon, neon, glitch, text, signature',
   null,
   'Flux',
   array['japan','noren','shop','daylight'],
   (select id from cats where slug = 'portrait'),
   false, true, 86, 31, 0),

  ('tokyo-neon-biker',
   '東京霓虹騎士', 'Tokyo Neon Rider',
   '賽博龐克風的澀谷夜景與重機。',
   'Cyberpunk Shibuya night with a motorcycle and neon glow.',
   'a leather-jacketed rider on a black sport bike under torrential neon rain in shibuya crossing, reflections on asphalt, cinematic wide-angle 24mm, blade runner color palette',
   'low contrast, washed out, flat lighting',
   '--ar 16:9',
   'Midjourney',
   array['cyberpunk','tokyo','neon','night'],
   (select id from cats where slug = 'cinematic'),
   false, true, 510, 201, 0),

  ('onsen-macaque',
   '雪猴入湯', 'Snow Monkey Onsen',
   '長野地獄谷雪猴泡溫泉。',
   'Japanese macaques bathing in a snowy onsen.',
   'a snow monkey soaking in a steamy onsen in jigokudani, snowflakes in the air, rich brown fur wet, telephoto 200mm, national geographic style',
   'fake, plush, 3d, cartoon',
   null,
   'SDXL',
   array['animal','winter','japan','wildlife'],
   (select id from cats where slug = 'macro'),
   false, true, 222, 77, 0),

  ('mount-fuji-sunrise',
   '富士御來光', 'Mount Fuji at Sunrise',
   '湖面倒映金色富士。',
   'Golden hour Fuji reflected in a still lake.',
   'majestic mount fuji at sunrise reflected perfectly in lake kawaguchiko, mist on the water, ultra high detail, landscape photography, 70mm, crystal clear',
   'low quality, jpeg artifacts, haze, overprocessed',
   null,
   'Flux',
   array['landscape','fuji','sunrise'],
   (select id from cats where slug = 'landscape'),
   false, true, 612, 250, 0),

  ('abstract-ink',
   '墨色漸變', 'Sumi Gradient',
   '水墨漸層與留白的抽象構成。',
   'Abstract composition of sumi ink gradients and negative space.',
   'abstract composition of sumi-e ink wash gradients, torn paper edges, minimal composition, off-white washi background, high contrast black ink',
   'color, text, photograph',
   null,
   'SDXL',
   array['abstract','ink','minimal'],
   (select id from cats where slug = 'abstract'),
   false, true, 65, 40, 0),

  ('salaryman-train',
   '最後一班電車', 'Last Train',
   '深夜電車裡的倦怠身影。',
   'Weary figure in a late-night Tokyo train.',
   'a tired salaryman in a dark suit on the last yamanote line at 11pm, fluorescent ceiling lights, reflection on the glass, soft vignette, 35mm film',
   'bright, cheerful, daylight',
   null,
   'SDXL',
   array['tokyo','train','night','mood'],
   (select id from cats where slug = 'portrait'),
   false, true, 189, 54, 0)
) as v(slug, title_zh, title_en, description_zh, description_en,
       body, negative, parameters, model, tags,
       category_id, is_nsfw, is_published, likes_count, favorites_count, views_count)
on conflict (slug) do nothing;

-- builder_elements ----------------------------------------------------
insert into public.builder_elements (type, label_zh, label_en, value, is_nsfw, weight) values
 -- subject
 ('subject','和服少女','Kimono girl','a young woman wearing a traditional kimono', false, 10),
 ('subject','老武士','Aging samurai','an aging samurai with weathered hands', false, 8),
 ('subject','街頭攝影師','Street photographer','a candid street photographer in tokyo', false, 6),
 ('subject','白貓','White cat','a slender white cat with amber eyes', false, 7),
 ('subject','機械少女','Mech girl','a cybernetic mech girl with chrome plating', false, 5),

 -- scene
 ('scene','祇園雨夜','Gion rainy night','walking through gion district on a rainy night', false, 10),
 ('scene','竹林小徑','Bamboo grove','standing in a misty bamboo grove at dawn', false, 9),
 ('scene','澀谷交叉路口','Shibuya crossing','crossing the shibuya intersection during rush hour', false, 7),
 ('scene','祖父家的緣側','Old engawa','sitting on an old wooden engawa overlooking a mossy garden', false, 6),
 ('scene','海邊神社','Seaside shrine','at a small torii gate by the sea at golden hour', false, 8),

 -- lighting
 ('lighting','電影級邊緣光','Cinematic rim light','cinematic rim light, soft shadows', false, 10),
 ('lighting','柔和窗光','Soft window light','soft diffused window light, overcast day', false, 9),
 ('lighting','黃金時刻','Golden hour','warm golden hour back lighting', false, 8),
 ('lighting','霓虹反射','Neon reflections','saturated neon reflections on wet pavement', false, 6),
 ('lighting','月光','Moonlight','cool blue moonlight through torn shoji', false, 5),

 -- camera
 ('camera','35mm 膠片','35mm film','shot on 35mm film, shallow depth of field', false, 10),
 ('camera','50mm 人像','50mm portrait','50mm portrait lens, f/1.8 bokeh', false, 9),
 ('camera','超廣角','Ultra-wide','24mm ultra-wide, dramatic perspective', false, 6),
 ('camera','長焦壓縮','Telephoto','200mm telephoto, compressed background', false, 5),
 ('camera','上帝視角','Top-down','top-down bird''s-eye view, flat composition', false, 4),

 -- style
 ('style','宮崎駿','Ghibli','ghibli-inspired hand painted 2d style', false, 10),
 ('style','新海誠','Makoto Shinkai','makoto shinkai style, vibrant skies', false, 9),
 ('style','水墨','Sumi-e','traditional sumi-e ink wash style', false, 7),
 ('style','浮世繪','Ukiyo-e','ukiyo-e woodblock print style', false, 6),
 ('style','賽博龐克','Cyberpunk','blade runner cyberpunk aesthetic', false, 8),

 -- quality
 ('quality','高細節','High detail','ultra high detail, 8k, sharp focus', false, 10),
 ('quality','電影色調','Cinematic grade','cinematic color grading, film grain', false, 9),
 ('quality','乾淨構圖','Clean composition','clean minimal composition, rule of thirds', false, 7),
 ('quality','淺景深','Shallow DOF','shallow depth of field, creamy bokeh', false, 8),
 ('quality','寫實材質','Photoreal','photorealistic texture, natural skin tones', false, 6),

 -- negative
 ('negative','基本反向','Baseline negative','blurry, low quality, jpeg artifacts, watermark, signature, text, extra fingers, deformed hands', false, 10),
 ('negative','反卡通','No cartoon','cartoon, anime, 3d, plastic, toy-like', false, 8),
 ('negative','反寫實','No realism','photorealistic, photo, 3d render', false, 6),
 ('negative','反過曝','No overexposure','overexposed, blown highlights, washed out', false, 5)
on conflict do nothing;

-- =====================================================================
-- 成為管理員：註冊後，執行
-- update public.profiles set is_admin = true where id = '<your-auth-user-uuid>';
-- =====================================================================
