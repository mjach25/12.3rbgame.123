const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
      app.use(express.static(path.join(__dirname, '../')));
}

const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  );

app.get(['/', '/freegame', '/steam', '/rdp', '/netflix', '/spotify', '/vpn', '/iptv', '/gift', '/crunchyroll', '/canva', '/android'], (req, res) => {
      res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/admin', (req, res) => {
      res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/api/games', async (req, res) => {
      const { data, error } = await supabase.from('games').select('*').order('id', { ascending: false });
      if (error) return res.status(500).json([]);
      res.json(data.map(g => ({
                id: g.id, title: g.title, platform: g.platform,
                genre: g.genre || [], year: g.year, rating: g.rating, dl: g.dl,
                img: g.img, hero: g.hero, hero2: g.hero2, hero3: g.hero3,
                link: g.link, desc: g.description, req: g.req || {}
      })));
});

app.post('/api/games', async (req, res) => {
      const b = req.body;
      const genre = Array.isArray(b.genre) ? b.genre : (b.genre || '').split(',').map(s => s.trim()).filter(Boolean);
      const { data, error } = await supabase.from('games').insert({
                title: b.title, platform: b.platform, genre,
                year: b.year, rating: b.rating, dl: b.dl, img: b.img,
                hero: b.hero, hero2: b.hero2, hero3: b.hero3,
                link: b.link, description: b.desc, req: b.req || {}
      }).select().single();
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true, game: { ...data, desc: data.description } });
});

app.put('/api/games/:id', async (req, res) => {
      const b = req.body;
      const genre = Array.isArray(b.genre) ? b.genre : (b.genre || '').split(',').map(s => s.trim()).filter(Boolean);
      const { error } = await supabase.from('games').update({
                title: b.title, platform: b.platform, genre,
                year: b.year, rating: b.rating, dl: b.dl, img: b.img,
                hero: b.hero, hero2: b.hero2, hero3: b.hero3,
                link: b.link, description: b.desc, req: b.req || {}
      }).eq('id', parseInt(req.params.id));
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true });
});

app.delete('/api/games/:id', async (req, res) => {
      const { error } = await supabase.from('games').delete().eq('id', parseInt(req.params.id));
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true });
});

app.get('/api/premium', async (req, res) => {
      const { data, error } = await supabase.from('premium').select('*').order('id', { ascending: false });
      if (error) return res.status(500).json([]);
      res.json(data.map(p => ({ ...p, user: p.username, pass: p.password, desc: p.description })));
});

app.post('/api/premium', async (req, res) => {
      const b = req.body;
      const { data, error } = await supabase.from('premium').insert({
                category: b.category, title: b.title, img: b.img, hero: b.hero,
                username: b.user, password: b.pass, description: b.desc
      }).select().single();
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true, item: { ...data, user: data.username, pass: data.password } });
});

app.put('/api/premium/:id', async (req, res) => {
      const b = req.body;
      const { error } = await supabase.from('premium').update({
                category: b.category, title: b.title, img: b.img, hero: b.hero,
                username: b.user, password: b.pass, description: b.desc
      }).eq('id', parseInt(req.params.id));
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true });
});

app.delete('/api/premium/:id', async (req, res) => {
      const { error } = await supabase.from('premium').delete().eq('id', parseInt(req.params.id));
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.json({ success: true });
});

app.get('/api/bot-accounts', async (req, res) => {
      const { data, error } = await supabase.from('bot_accounts').select('*').order('created_at', { ascending: false });
      if (error) return res.status(500).json([]);
      res.json(data.map(a => ({ _id: a.id, gameName: a.game_name, steamUser: a.steam_user, steamPass: a.steam_pass, imgUrl: a.img_url, category: a.category })));
});

app.post('/api/bot-accounts', async (req, res) => {
      const b = req.body;
      const { data, error } = await supabase.from('bot_accounts').insert({
                category: b.category, game_name: b.gameName, steam_user: b.steamUser,
                steam_pass: b.steamPass, img_url: b.imgUrl
      }).select().single();
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true, account: { _id: data.id, gameName: data.game_name, steamUser: data.steam_user, steamPass: data.steam_pass, imgUrl: data.img_url } });
});

app.put('/api/bot-accounts/:id', async (req, res) => {
      const b = req.body;
      const { error } = await supabase.from('bot_accounts').update({
                category: b.category, game_name: b.gameName, steam_user: b.steamUser,
                steam_pass: b.steamPass, img_url: b.imgUrl
      }).eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true });
});

app.delete('/api/bot-accounts/:id', async (req, res) => {
      const { error } = await supabase.from('bot_accounts').delete().eq('id', req.params.id);
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true });
});

app.get('/api/settings', async (req, res) => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (!data) return res.json({ heroLine1: 'Your Ultimate', heroLine2: 'Free Gaming', heroLine3: 'Destination', heroSub: 'Discover free games.', aboutText: 'Our mission...' });
      res.json({ heroLine1: data.hero_line1, heroLine2: data.hero_line2, heroLine3: data.hero_line3, heroSub: data.hero_sub, aboutText: data.about_text });
});

app.post('/api/settings', async (req, res) => {
      const b = req.body;
      const { error } = await supabase.from('settings').upsert({ id: 1, hero_line1: b.heroLine1, hero_line2: b.heroLine2, hero_line3: b.heroLine3, hero_sub: b.heroSub, about_text: b.aboutText });
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true });
});

app.get('/api/ads', async (req, res) => {
      const { data } = await supabase.from('ads').select('*').eq('id', 1).single();
      if (!data) return res.json({ rightAdEnabled: false, rightAdImage: '', rightAdLink: '' });
      res.json({ rightAdEnabled: data.right_ad_enabled, rightAdImage: data.right_ad_image, rightAdLink: data.right_ad_link });
});

app.post('/api/ads', async (req, res) => {
      const b = req.body;
      const { error } = await supabase.from('ads').upsert({ id: 1, right_ad_enabled: b.rightAdEnabled, right_ad_image: b.rightAdImage, right_ad_link: b.rightAdLink });
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true });
});

app.post('/api/bot/query', async (req, res) => {
      const { query } = req.body;
      if (!query) return res.json({ response: 'Please enter a game name!' });
      const { data } = await supabase.from('bot_accounts').select('*').ilike('game_name', `%${query}%`).limit(1).single();
      if (data) {
                const imgHtml = data.img_url ? `<img src="${data.img_url}" style="width:100%; border-radius:10px; margin-bottom:10px;">` : '';
                res.json({ success: true, response: `${imgHtml}<div style="font-size:16px;font-weight:800;color:#fff;margin-bottom:10px;">${data.game_name}</div><div style="display:flex;flex-direction:column;gap:6px;"><div class="copy-box" onclick="copyText('${data.steam_user}')"><span class="copy-lbl">USER</span><span class="copy-val">${data.steam_user}</span><i class="far fa-copy"></i></div><div class="copy-box" onclick="copyText('${data.steam_pass}')"><span class="copy-lbl">PASS</span><span class="copy-val">${data.steam_pass}</span><i class="far fa-copy"></i></div></div><div style="margin-top:10px;font-size:12px;color:var(--muted);">Enjoy your game!</div>` });
      } else {
                res.json({ success: false, response: "Sorry, I couldn't find an account for that game. Try another one!" });
      }
});

const PORT = process.env.PORT || 8181;
if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
