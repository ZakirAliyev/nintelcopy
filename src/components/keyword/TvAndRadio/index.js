// src/components/TvAndRadio/TvAndRadio.jsx
import './index.scss';
import Interval from "../../header/İnterval";
import { FaSearch } from "react-icons/fa";
import { Segmented, Modal, Spin, Empty } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import Cookies from 'js-cookie';
import { useState } from "react";
import { Slider } from "antd";
import "antd/dist/reset.css";

/** =================== KONFİQURASİYA =================== */
const API_BASE = process.env.REACT_APP_API_BASE;
const SEARCH_URL = `${API_BASE}/search/`;
const SUMMARIZE_URL = (id) => `${API_BASE}/summarize/${id}`;
const CARD_WIDTH = 230;
const GAP = 32;
const BASE_ROWS = 2;

/** =================== TOKEN HELPER =================== */
const getToken = () => {
    // let token = Cookies.get("token") || '';
    let token = '"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLm1lZGlhbGFiLmF6L2F1dGgvbG9naW4iLCJpYXQiOjE3NTU1MTczMzcsImV4cCI6MTc1NTUyMDkzNywibmJmIjoxNzU1NTE3MzM3LCJqdGkiOiJVRlRmVm4zdTNtRTFkZWxKIiwic3ViIjoiNiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.nERbWPj4msze2fylx7NxfDiLM-UPCrvdX3UhTPiXGqw"'
    return token.replace(/^"|"$/g, '');
};

/** =================== TARİX HELPERS =================== */
const fmt = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const getOneMonthRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setMonth(today.getMonth() - 1);
    return [fmt(start), fmt(today)];
};

const readSelectedDatesCookie = () => {
    try {
        const v = Cookies.get("selectedDates");
        const parsed = v ? JSON.parse(v) : null;
        return (Array.isArray(parsed) && parsed.length === 2) ? parsed : null;
    } catch {
        return null;
    }
};

// 💡 Modul yüklənəndə cookie yoxdursa -> [1 ay əvvəl, bu gün] yaz
(() => {
    const cur = readSelectedDatesCookie();
    if (!cur || !cur[0] || !cur[1]) {
        const range = getOneMonthRange();
        Cookies.set("selectedDates", JSON.stringify(range), { expires: 1 });
    }
})();

// Cookie-ni izləmək (Interval dəyişmədən)
const useSelectedDates = (pollMs = 700) => {
    const [dates, setDates] = useState(readSelectedDatesCookie());
    useEffect(() => {
        let alive = true;
        let last = JSON.stringify(readSelectedDatesCookie());
        const id = setInterval(() => {
            const cur = JSON.stringify(readSelectedDatesCookie());
            if (alive && cur !== last) {
                last = cur;
                setDates(cur ? JSON.parse(cur) : null);
            }
        }, pollMs);
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, [pollMs]);
    return dates;
};

/** =================== VIDEO CLIP URL HELPER =================== */
const buildClipUrl = (raw) => {
    const token = getToken();
    const channel = encodeURIComponent(raw?.channel_id || 'unknown');
    const videoFile = encodeURIComponent(raw?.segment_filename || '');
    const start = Number(raw?.start_offset_sec ?? 0);
    const duration = Number(raw?.duration_sec ?? raw?.duration ?? 30);

    const q = new URLSearchParams({
        channel,
        video_file: videoFile,
        start: String(start),
        duration: String(duration),
        access: token,
        _t: String(Date.now()),
    });

    return `${API_BASE}/video_clip/?${q.toString()}`;
};

/** =================== UTIL FUNKSİYALAR =================== */
const formatDate = (iso) => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    } catch {
        return iso;
    }
};

const highlight = (text, q) => {
    if (!q) return text;
    const parts = String(text).split(new RegExp(`(${q})`, "ig"));
    return parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase()
            ? <mark key={i}>{p}</mark>
            : <React.Fragment key={i}>{p}</React.Fragment>
    );
};

/** ======== Sanitize helpers (threshold və limit üçün) ======== */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const sanitizeThreshold = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const num = Number(v);
    if (Number.isNaN(num)) return null;
    return clamp(Number(num.toFixed(2)), 0, 1);
};
const sanitizeLimit = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const num = parseInt(v, 10);
    if (Number.isNaN(num)) return null;
    return clamp(num, 1, 500); // sən "max 500" demisən
};

function TvAndRadio() {
    const containerRef = useRef(null);
    const [perRow, setPerRow] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;
        const calcPerRow = () => {
            const width = containerRef.current.clientWidth;
            const count = Math.max(1, Math.floor((width + GAP) / (CARD_WIDTH + GAP)));
            setPerRow(count);
        };
        const ro = new ResizeObserver(calcPerRow);
        ro.observe(containerRef.current);
        window.addEventListener("resize", calcPerRow);
        calcPerRow();
        return () => {
            window.removeEventListener("resize", calcPerRow);
            ro.disconnect();
        };
    }, []);

    const [tab, setTab] = useState("TV");
    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebounced(query.trim()), 400);
        return () => clearTimeout(t);
    }, [query]);

    // Cookie-dən tarix aralığı (dinamik izlənir)
    const selectedDates = useSelectedDates(); // ["YYYY-MM-DD","YYYY-MM-DD"] | null

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rawResults, setRawResults] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showSummary, setShowSummary] = useState(false);

    const [summaryById, setSummaryById] = useState({});
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");

    // SVG klik üçün ayrıca modal state
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    /** ======== FILTER STATE (yalnız logic əlavə edildi) ======== */
        // İstifadəçi modalda dəyişir:
    const [filterChannel, setFilterChannel] = useState("");          // string | "" (boş olanda göndərmirik)
    const [filterThreshold, setFilterThreshold] = useState(0.4);     // number | null; default UI dəyəri
    const [filterLimit, setFilterLimit] = useState("");              // string daxil edilir, sanitize edirik

    // Tətbiq olunmuş filterlər (fetch bunlardan istifadə edir)
    const [appliedFilters, setAppliedFilters] = useState({
        channel: null,      // string | null
        threshold: null,    // number | null
        limit: null,        // number | null
    });

    const onApplyFilters = () => {
        const channel = filterChannel?.trim() || null;
        const threshold = sanitizeThreshold(filterThreshold);
        const limit = sanitizeLimit(filterLimit);

        setAppliedFilters({
            channel,
            // NOTE: API default 0.2-dir. İstifadəçi dəyər verməsə threshold-u null saxlayırıq ki, parametrlə göndərməyək.
            threshold: threshold === null ? null : threshold,
            limit: limit === null ? null : limit,
        });
        setIsIconModalOpen(false);
    };

    const onClearFilters = () => {
        setFilterChannel("");
        setFilterThreshold(0.4);
        setFilterLimit("");
        setAppliedFilters({ channel: null, threshold: null, limit: null });
        setIsIconModalOpen(false);
    };

    /** ======== CARD MODAL ======== */
    const onCardClick = (sectionIndex, cardIndex, item) => {
        setSelectedCard({ sectionIndex, cardIndex, item });
        setIsModalOpen(true);
        setShowSummary(false);
        setSummaryError("");
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
        setShowSummary(false);
        setSummaryError("");
    };

    const [rowsToShow, setRowsToShow] = useState({});
    const incRows = (idx) =>
        setRowsToShow((s) => ({ ...s, [idx]: (s[idx] ?? BASE_ROWS) + 1 }));

    /** =================== SEARCH FETCH (keyword + start_date/end_date + filters) =================== */
    useEffect(() => {
        const token = getToken();

        if (!debounced) {
            setRawResults([]);
            setError("");
            setLoading(false);
            return;
        }
        if (!token) {
            setRawResults([]);
            setError("Token tapılmadı. Zəhmət olmasa daxil olun.");
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const run = async () => {
            setLoading(true);
            setError("");
            try {
                const params = new URLSearchParams({ keyword: debounced });

                // Tarix aralığı
                const range = (selectedDates && selectedDates[0] && selectedDates[1])
                    ? selectedDates
                    : getOneMonthRange();

                params.set("start_date", range[0]);
                params.set("end_date", range[1]);

                // ======== YENİ: yalnız mövcud olan filterləri əlavə et ========
                // channel: string (boşdursa göndərməyək)
                if (appliedFilters.channel) {
                    params.set("channel", appliedFilters.channel);
                }

                // threshold: number 0..1 (API default 0.2 – verməsək default işləyəcək)
                if (typeof appliedFilters.threshold === "number") {
                    params.set("threshold", String(appliedFilters.threshold));
                }

                // limit: integer
                if (typeof appliedFilters.limit === "number") {
                    params.set("limit", String(appliedFilters.limit));
                }

                // (Opsional) TV/Radio filteri
                // params.set("source_type", tab.toLowerCase());

                const url = `${SEARCH_URL}?${params.toString()}`;

                const res = await fetch(url, {
                    method: "GET",
                    redirect: "follow",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    let msg = `Server ${res.status} qaytardı`;
                    try {
                        const j = await res.json();
                        if (j?.detail) msg += ` – ${j.detail}`;
                    } catch { }
                    throw new Error(msg);
                }

                const json = await res.json();
                setRawResults(Array.isArray(json) ? json : []);
            } catch (e) {
                if (e.name !== "AbortError") {
                    setError(e.message || "Xəta baş verdi");
                    setRawResults([]);
                }
            } finally {
                setLoading(false);
            }
        };
        run();
        return () => controller.abort();
    }, [debounced, selectedDates, appliedFilters /*, tab */]);

    /** =================== Qruplama =================== */
    const sections = useMemo(() => {
        if (!rawResults?.length) return [];
        const map = new Map();
        for (const seg of rawResults) {
            const key = seg.channel_id || "unknown";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(seg);
        }
        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([channel, items], idx) => {
                const cardItems = items
                    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
                    .map((it, i) => ({
                        id: it.id ?? `${channel}-${i}`,
                        title: it.text || "(boş mətn)",
                        date: formatDate(it.start_time),
                        videoSrc: buildClipUrl(it),
                        raw: it,
                    }));
                return { id: idx, name: channel, count: cardItems.length, items: cardItems };
            });
    }, [rawResults]);

    const filteredSections = sections.filter(section => {
        const isRadio = section.name.toLowerCase().includes('radio');
        return tab === "Radio" ? isRadio : !isRadio;
    });

    /** =================== SUMMARY FETCH =================== */
    const fetchSummary = async (segmentId) => {
        if (summaryById[segmentId]?.text) return;
        const token = getToken();

        if (!token) {
            setSummaryError("Token tapılmadı. Zəhmət olmasa daxil olun.");
            return;
        }

        setSummaryLoading(true);
        setSummaryError("");
        try {
            const res = await fetch(SUMMARIZE_URL(segmentId), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                let msg = `Summary: server ${res.status} qaytardı`;
                try {
                    const j = await res.json();
                    if (j?.detail) msg += ` – ${j.detail}`;
                } catch { }
                throw new Error(msg);
            }

            const data = await res.json();
            const summaryText = data?.summary ?? "";
            const sentiment = data?.sentiment ?? null;

            setSummaryById((prev) => ({
                ...prev,
                [segmentId]: { text: summaryText, sentiment },
            }));
        } catch (e) {
            setSummaryError(e.message || "Xülasə alınarkən xəta baş verdi");
        } finally {
            setSummaryLoading(false);
        }
    };

    const onClickSummary = async () => {
        if (!selectedCard?.item?.raw?.id) return;
        const segId = selectedCard.item.raw.id;
        setShowSummary(true);
        await fetchSummary(segId);
    };

    const arr = [
        { id: "alvinchannel", displayName: "Alvin Channel" },
        { id: "apatv", displayName: "APA TV" },
        { id: "arb24", displayName: "ARB 24" },
        { id: "arb", displayName: "ARB" },
        { id: "arbgunes", displayName: "ARB Günəş" },
        { id: "azadtv", displayName: "Azad TV" },
        { id: "aztv", displayName: "AzTV" },
        { id: "bakutv", displayName: "Baku TV" },
        { id: "cbcsport", displayName: "CBC Sport" },
        { id: "dunyatv", displayName: "Dünya TV" },
        { id: "eltv", displayName: "EL TV" },
        { id: "medeniyyettv", displayName: "Mədəniyyət TV" },
        { id: "spacetv", displayName: "Space TV" },
        { id: "xezertv", displayName: "Xəzər TV" },
        { id: "itv", displayName: "İTV" },
        { id: "itvradio", displayName: "İTV Radio" },
        { id: "aztvradio", displayName: "AzTV Radio" },
        { id: "asanradio", displayName: "ASAN Radio" },
        { id: "realradio", displayName: "Real Radio" }
    ];


    // Desktop/Mobile aşkarı
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /** =================== RENDER =================== */
    return (
        <div className={"container"} style={{ margin: '0 auto' }}>
            <section id={"tvAndRadio"}>
                {/* Üst filter xətti */}
                <div className={"firstWrapper"}>
                    <div className={"intervalWrapper"}>
                        <Interval />
                    </div>

                    <div className={"inputWrapper"}>
                        <input
                            placeholder={"Search"}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <FaSearch className={"icon"} />
                        <div
                            className={"icon1"}
                            onClick={() => setIsIconModalOpen(true)}
                            role="button"
                            aria-label="Ayarlar"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsIconModalOpen(true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 1.5C8.06902 1.49951 7.16081 1.78778 6.40053 2.32508C5.64025 2.86239 5.06533 3.62227 4.755 4.5H0V7.5H4.755C5.0649 8.3783 5.63961 9.13885 6.3999 9.67682C7.16019 10.2148 8.06863 10.5037 9 10.5037C9.93137 10.5037 10.8398 10.2148 11.6001 9.67682C12.3604 9.13885 12.9351 8.3783 13.245 7.5H24V4.5H13.245C12.9347 3.62227 12.3598 2.86239 11.5995 2.32508C10.8392 1.78778 9.93098 1.49951 9 1.5ZM7.5 6C7.5 5.60218 7.65804 5.22065 7.93934 4.93934C8.22064 4.65804 8.60218 4.5 9 4.5C9.39782 4.5 9.77936 4.65804 10.0607 4.93934C10.342 5.22065 10.5 5.60218 10.5 6C10.5 6.39783 10.342 6.77936 10.0607 7.06066C9.77936 7.34197 9.39782 7.5 9 7.5C8.60218 7.5 8.22064 7.34197 7.93934 7.06066C7.65804 6.77936 7.5 6.39783 7.5 6ZM15 13.5C14.069 13.4995 13.1608 13.7878 12.4005 14.3251C11.6402 14.8624 11.0653 15.6223 10.755 16.5H0V19.5H10.755C11.0649 20.3783 11.6396 21.1389 12.3999 21.6768C13.1602 22.2148 14.0686 22.5037 15 22.5037C15.9314 22.5037 16.8398 22.2148 17.6001 21.6768C18.3604 21.1389 18.9351 20.3783 19.245 19.5H24V16.5H19.245C18.9347 15.6223 18.3598 14.8624 17.5995 14.3251C16.8392 13.7878 15.931 13.4995 15 13.5ZM13.5 18C13.5 17.6022 13.658 17.2206 13.9393 16.9393C14.2206 16.658 14.6022 16.5 15 16.5C15.3978 16.5 15.7794 16.658 16.0607 16.9393C16.342 17.2206 16.5 17.6022 16.5 18C16.5 18.3978 16.342 18.7794 16.0607 19.0607C15.7794 19.342 15.3978 19.5 15 19.5C14.6022 19.5 14.2206 19.342 13.9393 19.0607C13.658 18.7794 13.5 18.3978 13.5 18Z"
                                    fill="#929292" />
                            </svg>
                        </div>
                    </div>

                    <div className={"segmentedWrapper"}>
                        <Segmented
                            size={"large"}
                            options={["TV", "Radio"]}
                            value={tab}
                            onChange={(value) => setTab(value)}
                        />
                    </div>
                </div>

                <div ref={containerRef} className={"secondWrapperWrapper"}>
                    {loading && (
                        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                            <Spin />
                        </div>
                    )}

                    {!loading && error && (
                        <div style={{ padding: 16, color: "var(--danger, #d33)" }}>
                            {error}
                        </div>
                    )}

                    {!loading && !error && !debounced && (
                        <div style={{ padding: 16, opacity: 0.8, textAlign: 'center', marginTop: '32px' }}
                             className={"ant-empty-description"}>
                            Axtarmaq üçün yuxarıdakı sahəyə açar söz yazın.
                        </div>
                    )}

                    {!loading && !error && debounced && filteredSections.length === 0 && (
                        <div style={{ padding: 24 }}>
                            <Empty description="Nəticə tapılmadı" />
                        </div>
                    )}

                    {!loading && !error && filteredSections.map((section, sectionIndex) => {
                        const visible = perRow * (rowsToShow[sectionIndex] ?? BASE_ROWS);
                        const total = section.items.length;
                        const hasMore = visible < total;

                        return (
                            <div className={"secondWrapper"} key={section.id}>
                                <div className={"titleWrapper"}>
                                    <div className={"title"}>{section.name}</div>
                                    <div className={"box"}>{section.count}</div>
                                </div>

                                <div className={`cardWrapper ${hasMore ? "is-collapsed" : ""}`}>
                                    {section.items.slice(0, visible).map((item, cardIndex) => (
                                        <div
                                            className={"card"}
                                            key={item.id}
                                            onClick={() => onCardClick(sectionIndex, cardIndex, item)}
                                        >
                                            <div className={"title"}>{highlight(item.title, debounced)}</div>
                                            <div className={"line"} />
                                            <div className={"date"}>{formatDate(item.raw?.start_time)}</div>
                                        </div>
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="showMoreWrapper">
                                        <button className="showMoreBtn" onClick={() => incRows(sectionIndex)}>
                                            Daha çox
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mövcud modal (kart klik) */}
                <Modal
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                    title={null}
                    destroyOnClose
                    maskClosable
                    width={1100}
                    zIndex={9999}
                >
                    {!showSummary ? (
                        <>
                            <div className={"videoWrapper"}>
                                {selectedCard?.item?.videoSrc ? (
                                    <video controls className={"videoMy"}>
                                        <source src={selectedCard.item.videoSrc} type="video/mp4" />
                                        Sizin brauzer video tagını dəstəkləmir.
                                    </video>
                                ) : (
                                    <div style={{ padding: 16, opacity: 0.8 }}>
                                        Video üçün fayl URL-i tapılmadı.
                                    </div>
                                )}
                            </div>

                            <div className={"line123"} />
                            <div className="modalActions">
                                <div className="actionsLeft">Mətn</div>
                                <div className="actionsRight">
                                    <button
                                        className={`switchBtn ${showSummary ? "active" : ""}`}
                                        onClick={onClickSummary}
                                    >
                                        Xülasə
                                    </button>
                                </div>
                            </div>

                            <div className={"melumat"}>
                                {selectedCard ? (
                                    <>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Kanal:</strong> {filteredSections[selectedCard.sectionIndex]?.name}
                                            &nbsp;|&nbsp;
                                            <strong>ID:</strong> {selectedCard.item?.raw?.id}
                                            &nbsp;|&nbsp;
                                            <strong>Başlama:</strong> {formatDate(selectedCard.item?.raw?.start_time)}
                                        </div>
                                        <p>{selectedCard.item?.raw?.text}</p>
                                    </>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <div className="parent">
                            <div className="div1">
                                <div className="videoWrapper split">
                                    {selectedCard?.item?.videoSrc ? (
                                        <video controls className={"videoMy"}>
                                            <source src={selectedCard.item.videoSrc} type="video/mp4" />
                                            Sizin brauzer video tagını dəstəkləmir.
                                        </video>
                                    ) : (
                                        <div style={{ padding: 16, opacity: 0.8 }}>
                                            Video üçün fayl URL-i tapılmadı.
                                        </div>
                                    )}
                                </div>
                                <div className={"div2"}>
                                    <div className="summaryCard">
                                        <div className="summaryHeader">
                                            <h3>Summary</h3>
                                            <span
                                                className={`sentiment ${summaryById[selectedCard?.item?.raw?.id]?.sentiment?.toLowerCase?.() || 'neutral'}`}>
                        {summaryById[selectedCard?.item?.raw?.id]?.sentiment || 'Neutral'}
                      </span>
                                        </div>
                                        <div className="summaryBody">
                                            {summaryLoading ? (
                                                <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
                                                    <Spin />
                                                </div>
                                            ) : summaryError ? (
                                                <div style={{ color: 'var(--danger, #d33)' }}>{summaryError}</div>
                                            ) : (
                                                <p>
                                                    {summaryById[selectedCard?.item?.raw?.id]?.text || "Xülasə tapılmadı."}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="div3">
                                {selectedCard ? (
                                    <>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Kanal:</strong> {filteredSections[selectedCard.sectionIndex]?.name}
                                            &nbsp;|&nbsp;
                                            <strong>ID:</strong> {selectedCard.item?.raw?.id}
                                            &nbsp;|&nbsp;
                                            <strong>Başlama:</strong> {formatDate(selectedCard.item?.raw?.start_time)}
                                        </div>
                                        <p>{selectedCard.item?.raw?.text}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}
                </Modal>

                {/* SVG (filter) modal – GÖRÜNÜŞ DEYİŞMƏDİ, yalnız LOGIC əlavə olundu */}
                <Modal
                    open={isIconModalOpen}
                    onCancel={() => setIsIconModalOpen(false)}
                    footer={null}
                    title={null}
                    destroyOnClose
                    maskClosable
                    width={900}
                    zIndex={10000}
                >
                    {isDesktop ? (
                        <>
                            <p className={"filterText"}>Filter</p>
                            <div className={"wrapperBox"}>
                                <div className={"wrapperBox1"}>
                                    <div className={"menimBox"}>Kanal</div>

                                    {/* Seçim qutusu (istəsən real kanallarını burada render et) */}
                                    <select
                                        className="max-w-[200px] min-w-[150px] max-md:hidden duration-200 bg-[#36394c] border-[#6e727d] text-white border-[1px] text-center rounded-[4px] outline-none max-md:h-[40px]"
                                        value={filterChannel}
                                        onChange={(e) => setFilterChannel(e.target.value)}
                                    >
                                        <option value="">Hamısı</option>
                                        {arr && arr.map((channel, idx) => (
                                            <option key={idx} value={channel.id}>
                                                {channel.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={"wrapperBox1"}>
                                    <div className={"menimBox"}>Limit</div>
                                    <input
                                        type="number"
                                        placeholder="Susmaya görə 50, max 500"
                                        className={"input1"}
                                        value={filterLimit}
                                        onChange={(e) => setFilterLimit(e.target.value)}
                                        min={1}
                                        max={500}
                                    />
                                </div>
                            </div>

                            <div className={"wrapperBox"} style={{ marginTop: 0 }}>
                                <div className={"wrapperBox1"}>
                                    <div className={"menimBox"} style={{ width: "250px" }}>
                                        Bənzərlik dərəcəsi
                                    </div>
                                    <div style={{ width: 590, padding: 50, color: "white" }}>
                                        <Slider
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            marks={{
                                                0.0: "0.0",
                                                0.2: "0.2",
                                                0.4: "0.4",
                                                0.6: "0.6",
                                                0.8: "0.8",
                                                1.0: "1.0",
                                            }}
                                            value={filterThreshold}
                                            onChange={(v) => setFilterThreshold(sanitizeThreshold(v) ?? 0)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={"buttonWrapper123"}>
                                <button onClick={onClearFilters}>Ləğv et</button>
                                <button className={"button1"} onClick={onApplyFilters}>Təsdiqlə</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className={"filterText1"}>Filter</p>

                            <div className={"wrapperBox"} style={{ marginTop: 30 }}>
                                <div className={"menimBox1"}>Kanal</div>
                                <select
                                    className="menimSelect max-w-[200px] min-w-[150px] duration-200 bg-[#36394c] border-[#6e727d] text-white border-[1px] text-center rounded-[4px] outline-none"
                                    value={filterChannel}
                                    onChange={(e) => setFilterChannel(e.target.value)}
                                >
                                    <option value="">Hamısı</option>
                                    {arr && arr.map((channel, idx) => (
                                        <option key={idx} value={channel.id}>
                                            {channel.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={"wrapperBox"} style={{ marginTop: 16 }}>
                                <div className={"menimBox1"}>Limit</div>
                                <input
                                    type="number"
                                    placeholder="Susmaya görə 50"
                                    className={"input"}
                                    value={filterLimit}
                                    onChange={(e) => setFilterLimit(e.target.value)}
                                    min={1}
                                    max={500}
                                />
                            </div>

                            <div className={"wrapperBox"} style={{ marginTop: 36, flexDirection: 'column' }}>
                                <div className={"menimBox1"} style={{ width: '100%' }}>Bənzərlik dərəcəsi</div>
                                <div style={{ width: '100%', padding: 0, color: "white" }}>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        marks={{
                                            0.0: "0.0",
                                            0.2: "0.2",
                                            0.4: "0.4",
                                            0.6: "0.6",
                                            0.8: "0.8",
                                            1.0: "1.0",
                                        }}
                                        value={filterThreshold}
                                        onChange={(v) => setFilterThreshold(sanitizeThreshold(v) ?? 0)}
                                    />
                                </div>
                            </div>

                            <div className={"buttonWrapper123"}>
                                <button onClick={onClearFilters}>Ləğv et</button>
                                <button className={"button1"} onClick={onApplyFilters}>Təsdiqlə</button>
                            </div>
                        </div>
                    )}
                </Modal>
            </section>
        </div>
    );
}

export default TvAndRadio;
