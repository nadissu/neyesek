# neyesek — Deploy & Restart Rehberi

Bu doküman **neyesek** Node.js uygulamasını (PM2 + Nginx + Cloudflare Origin SSL) güncelleme, yeniden başlatma ve sorun giderme adımlarını içerir.

---

## Mimari Özet

* **Node.js app (Express)**: `server.js`
* **Port (origin)**: `3011`
* **PM2 process adı**: `neyesek`
* **Sunucu**: `46.203.248.145`
* **Domain**: `https://neyesek.yoursidetech.com` (Cloudflare proxy açık)
* **Nginx**: Reverse proxy → `127.0.0.1:3011`
* **SSL**: Cloudflare **Origin** sertifikası (Full Strict)

> PM2 adını bilmiyorsanız: `pm2 status` ile görün.

---

## Güncelleme (En Kısa Yol)

1. **Sunucuya bağlan**

   ```bash
   ssh deploy@46.203.248.145
   ```
2. **Projeye gir**

   ```bash
   cd /home/deploy/apps/neyesek/neyesek
   ```
3. **Son değişiklikleri çek**

   ```bash
   git pull
   ```
4. **Gerekliyse bağımlılık ve build**

   * Sadece JS kodu değiştiyse → atla
   * `package.json` değiştiyse:

     ```bash
     npm ci
     ```
   * Frontend derlemesi gerekiyorsa:

     ```bash
     npm ci
     npm run build
     ```
5. **Kesintisiz reload**

   ```bash
   pm2 reload neyesek
   ```

   > `.env` değiştiyse:

   ```bash
   pm2 restart neyesek --update-env
   ```
6. **Sağlık kontrolleri**

   ```bash
   ss -lntp | grep 3011
   curl -I http://127.0.0.1:3011
   curl -I -H "Host: neyesek.yoursidetech.com" https://127.0.0.1/ --insecure
   ```

---

## PM2 Kurulum & Yapılandırma (Bir Kez)

**ecosystem.config.js**:

```js
module.exports = {
  apps: [
    {
      name: "neyesek",
      script: "server.js",
      cwd: "/home/deploy/apps/neyesek/neyesek",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3011"
      },
      watch: false,
      max_memory_restart: "300M",
      out_file: "/home/deploy/.pm2/logs/neyesek-out.log",
      error_file: "/home/deploy/.pm2/logs/neyesek-error.log",
      merge_logs: true
    }
  ]
}
```

Başlat & kalıcı yap:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
# Çıkan systemctl komutunu sudo ile çalıştır.
```

### Faydalı PM2 Komutları

```bash
pm2 status
pm2 logs neyesek --lines 200
pm2 logs neyesek --err --lines 200
pm2 reload neyesek
pm2 restart neyesek --update-env
pm2 describe neyesek
```

---

## Nginx Konfig Özeti

`/etc/nginx/sites-available/neyesek.conf` örneği:

```nginx
server {
    listen 80;
    server_name neyesek.yoursidetech.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name neyesek.yoursidetech.com;

    ssl_certificate     /etc/ssl/cloudflare/neyesek_origin.crt;
    ssl_certificate_key /etc/ssl/cloudflare/neyesek_origin.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    client_max_body_size 25M;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;

    location / {
        proxy_pass http://127.0.0.1:3011;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
```

Değişiklik sonrası:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Cloudflare Ayarları

* **DNS**: `A neyesek → 46.203.248.145` (**Proxied = ON**)
* **SSL/TLS → Overview**: **Full (strict)**
* **Origin Certificate**: Sunucuda yollar →

  * Cert: `/etc/ssl/cloudflare/neyesek_origin.crt`
  * Key:  `/etc/ssl/cloudflare/neyesek_origin.key`

Dosyaları oluşturma:

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/neyesek_origin.crt   # CF Origin Certificate içeriğini yapıştır
sudo nano /etc/ssl/cloudflare/neyesek_origin.key   # CF Private Key içeriğini yapıştır
sudo chown root:root /etc/ssl/cloudflare/neyesek_origin.*
sudo chmod 644 /etc/ssl/cloudflare/neyesek_origin.crt
sudo chmod 600 /etc/ssl/cloudflare/neyesek_origin.key
```

---

## Sorun Giderme

**502 Bad Gateway (Cloudflare/Nginx)**

* App down → `pm2 status`, `pm2 logs`
* Yanlış port → `ss -lntp | grep 3011`
* Nginx hatası → `sudo nginx -t`

**525 SSL handshake failed**

* Nginx’te origin cert/key yolu hatalı olabilir
* Cloudflare SSL modu **Full (strict)** olmalı

**Kod güncellendi ama eski sayfa geliyor**

* Cloudflare cache → **Caching → Purge by URL**
* Tarayıcı cache → hard refresh (Ctrl/Cmd + F5)

**ENV değişti ama uygulama görmüyor**

```bash
pm2 restart neyesek --update-env
```

**Nginx logları**

```bash
journalctl -u nginx -n 200 --no-pager
```

---

## Rollback (Hızlı Geri Dönüş)

```bash
git log --oneline
git checkout <eski_commit>
pm2 reload neyesek
# Kalıcı dönüş için yeni commit (git revert) önerilir.
```

---

## Tek Komutla Mini Deploy (Opsiyonel)

`~/.bashrc` içine alias:

```bash
alias neyesek-deploy='cd /home/deploy/apps/neyesek/neyesek && git pull && npm ci --silent && pm2 reload neyesek && pm2 logs neyesek --lines 20'
```

Kullanım:

```bash
source ~/.bashrc
neyesek-deploy
```

---

## Sağlık Kontrolü Hızlı Komutlar

```bash
ss -lntp | grep 3011
curl -I http://127.0.0.1:3011
curl -I -H "Host: neyesek.yoursidetech.com" https://127.0.0.1/ --insecure
```

---

## Sürümler & Notlar

* Node.js LTS önerilir.
* `npm ci` lock dosyasını (package-lock.json) baz alır — üretimde deterministik kurulum sağlar.
* `pm2 reload` zero-downtime sağlar; config/env değişiminde `--update-env` kullanın.

---

**Hazırlayan:** Operasyon notları — neyesek
