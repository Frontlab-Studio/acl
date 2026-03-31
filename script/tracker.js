
(function () {
    // ==========================================
    // 1. DADOS DO CLIENTE (MUDE APENAS AQUI)
    // ==========================================
    const CONFIG = {
        // ATENÇÃO: Coloque a URL completa apontando para a Tabela do cliente
        url: "https://thduwjmzzqexvethhogf.supabase.co/cli_01_alexandre_acl",
        key: "sb_publishable_t3xQ6XifTSE7FmjKa5EWug_wKolazNF",
        timeout: 800 // Escudo de UX (800ms) - Não alterar
    };

    // ==========================================
    // 2. MOTOR RASTREADOR (NÃO ALTERAR)
    // ==========================================
    document.addEventListener("click", async function (e) {
        // Verifica se o elemento clicado é um botão rastreado
        const target = e.target.closest('[data-track="true"]');
        if (!target) return;

        // Extrai os dados da ação
        const coluna = target.getAttribute("data-coluna");
        const href = target.getAttribute("href");
        const isBlank = target.getAttribute("target") === "_blank";

        if (!coluna) return;

        // Intercepta a navegação imediatamente para garantir controle
        if (!isBlank && href && href !== '#') {
            e.preventDefault();
        }

        // Escudo Anti-Spam (Bloqueia múltiplos cliques na mesma coluna por 24h)
        const storageKey = `fl_track_${coluna}`;
        const lastClick = localStorage.getItem(storageKey);
        const now = Date.now();

        if (lastClick && (now - parseInt(lastClick) < 86400000)) { // 24h em ms
            liberarNavegacao(isBlank, href);
            return;
        }

        // Grava o cache no milissegundo do clique
        localStorage.setItem(storageKey, now.toString());

        // Execução Blindada de Alta Performance
        try {
            const fetchPromise = fetch(CONFIG.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": CONFIG.key,
                    "Authorization": `Bearer ${CONFIG.key}`,
                    "Prefer": "return=minimal" // Otimização de dados
                },
                body: JSON.stringify({ [coluna]: 1 }),
                keepalive: true // Garante o envio mesmo se a aba fechar na mesma hora
            });

            // Disputa de tempo: Se o banco demorar mais de 800ms, o timeout vence
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), CONFIG.timeout)
            );

            await Promise.race([fetchPromise, timeoutPromise]);
        } catch (err) {
            console.warn("[Frontlab Tracker] Falha silenciosa contornada ou limite de 800ms atingido.");
        } finally {
            // Em qualquer cenário (sucesso, erro ou lentidão), o cliente final navega.
            liberarNavegacao(isBlank, href);
        }
    });

    // Função auxiliar para redirecionamento seguro
    function liberarNavegacao(isBlank, href) {
        if (!isBlank && href && href !== '#') {
            window.location.href = href;
        }
    }
})();