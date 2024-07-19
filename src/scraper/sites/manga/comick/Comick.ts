import * as cheerio from "cheerio";
import axios from "axios";
import { Manga, MangaChapter, IMangaResult, IMangaList, IMangaTop } from "../../../../types/manga";
import { IResultSearch,  } from "../../../../types/search";
import { stat } from "fs";

//Default Set Axios Cookie
axios.defaults.withCredentials = true
axios.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G532G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/12.0 Chrome/79.0.3945.136 Mobile Safari/537.36";

/** List of Domains
 * https://comick.app
 * 
 * https://api.comick.app
 * 
 * https://api.comick.io
 * 
 * https://comick.cc
 * 
 * https://meo.comick.pictures
*/


export class Comick {
    readonly url = "https://comick.app";
    readonly api = "https://api.comick.fun"

    async GetMangaByFilter(search?: string, type?: number, year?: string, genres?: string, page?: number, limit?: number, 
        sort?: string, country?: string, status?: number)  {
        try {
            const { data } = await axios.get(`${this.api}/v1.0/search`, {
                
                params: {
                    q: search,
                    type: type,
                    year: year,
                    genres: genres,
                     page: page,
                    limit: limit,
                    sort: sort,
                    country: country,
                    status: status,
                }
            });
        
            const ResultList: IResultSearch<IMangaResult> = {
                results: []
            }
            data.map((e: { id: number; title: string;  last_chapter: string; md_covers: { b2key: string; }[]; slug: string; country: string;  }) => {
                const ListMangaResult: IMangaResult = {
                    id: e.slug,
                    slug: e.slug,
                    title: e.title,
                    last_chapter: e.last_chapter,
                     country: e.country,
                     thumbnail: {
                        url: "https://meo.comick.pictures/" + e.md_covers[0].b2key
                    },
                    url: `/manga/comick/title/${e.slug}`
                 }
                ResultList.results.push(ListMangaResult)
            })

            return ResultList
        } catch (error) {
            console.log(error)
        }
    }

    async GetMangaByTop(comic_types?: string) {
    try {
        const { data } = await axios.get(`${this.api}/top`, {
            params: {
                comic_types: comic_types,
            }
        });
        
        const resultList: IResultSearch<IMangaTop> = {
            results: data.rank.map((e: { slug: string, title: string, md_covers:[{ b2key: string } ] }) => {
               const listMangaResult: IMangaTop = {
                    
                    id: e.slug,
                    title: e.title,
                   thumbnail: {
                        url: "https://meo.comick.pictures/" + e.md_covers[0].b2key
                    },
                    url: `/manga/comick/title/${e.slug}`

                };
                

                return listMangaResult;
                
            })
            
        };

        return resultList;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

    async GetMangaByRecentRank(comic_types?: string) {
    try {
        const { data } = await axios.get(`${this.api}/top`, {
            params: {
                comic_types: comic_types,
            }
        });
        
        const resultList: IResultSearch<IMangaTop> = {
            results: data.recentRank.map((e: { slug: string, title: string, md_covers:[{ b2key: string } ] }) => {
               const listMangaResult: IMangaTop = {
                    
                    id: e.slug,
                    title: e.title,
                   thumbnail: {
                        url: "https://meo.comick.pictures/" + e.md_covers[0].b2key
                    },
                    url: `/manga/comick/title/${e.slug}`

                };
                

                return listMangaResult;
                
            })
            
        };

        return resultList;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

  async GetMangaExtendedNews(comic_types?: string) {
    try {
        const { data } = await axios.get(`${this.api}/top`, {
            params: {
                comic_types: comic_types,
            }
        });
        
        const resultList: IResultSearch<IMangaTop> = {
            results: data.extendedNews.map((e: { slug: string, title: string, md_covers:[{ b2key: string } ] }) => {
               const listMangaResult: IMangaTop = {
                    
                    id: e.slug,
                    title: e.title,
                   thumbnail: {
                        url: "https://meo.comick.pictures/" + e.md_covers[0].b2key
                    },
                    url: `/manga/comick/title/${e.slug}`

                };
                

                return listMangaResult;
                
            })
            
        };

        return resultList;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

  async GetMangaCompletions(comic_types?: string) {
    try {
        const { data } = await axios.get(`${this.api}/top`, {
            params: {
                comic_types: comic_types,
            }
        });
        
        const resultList: IResultSearch<IMangaTop> = {
            results: data.completions.map((e: { slug: string, title: string, md_covers:[{ b2key: string } ] }) => {
               const listMangaResult: IMangaTop = {
                    
                    id: e.slug,
                    title: e.title,
                   thumbnail: {
                        url: "https://meo.comick.pictures/" + e.md_covers[0].b2key
                    },
                    url: `/manga/comick/title/${e.slug}`

                };
                

                return listMangaResult;
                
            })
            
        };

        return resultList;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async GetChaptersByHot(type?: string, page?: number, order?: string) {
    try {
        const { data } = await axios.get(`${this.api}/chapter/`, {
            params: {
                page: page,
                order: order,
                tachiyomi: true,
                lang: 'en', 
                type: type, // Include 'type' parameter if provided
             }
        });

        // Process the data to create a list of manga chapters
        const resultList: IResultSearch<IMangaList> = {
            results: data.map((e: { id: number; chap: string; hid: string; lang: string; md_comics: { title: string; slug: string; md_covers: { b2key: string }[] } }) => {
                const mdComic = e.md_comics;

                // Extract md_comics title
                const title = mdComic ? mdComic.title : '';

                // Extract md_comics md_covers
                const mdCovers = mdComic && mdComic.md_covers && mdComic.md_covers.length > 0 ?
                    mdComic.md_covers.map(cover => cover.b2key) :
                    [];
                const slug = mdComic ? mdComic.slug : '';

                // Construct thumbnail URL using the first md_cover b2key
                const thumbnailUrl = mdCovers.length > 0 ?
                    `https://meo.comick.pictures/${mdCovers[0]}` :
                    '';

                const listMangaResult: IMangaList = {
                    id: slug,
                    title: title,
                    lang: e.lang,
                    chapterId: `${e.hid}-${slug}-${e.lang}`,
                    chap: e.chap,
                    slug: slug,
                    thumbnail: {
                        url: thumbnailUrl
                    },
                    url: `/manga/comick/title/${slug}`,
                    url2: `/manga/comick/chapter/${e.hid}-${slug}?lang=en`,
                 };

                return listMangaResult;
            })
        };

        return resultList;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to be handled by the caller
    }
}




    async GetMangaInfo(manga: string, lang: string): Promise<Manga> {
        try {
            const { data } = await axios.get(`${this.api}/comic/${manga}`);
            // build static
            ///_next/data/S1XqseNRmzozm3TaUH1lU/comic/00-solo-leveling.json
            const currentLang = lang ? `?lang=${lang}` : `?lang=en`
            const mangaInfoParseObj = data

        const dataApi = await axios.get(`${this.api}/comic/${mangaInfoParseObj.comic.hid}/chapters${currentLang}&limit=10000`);
   
            const MangaInfo: Manga = {
                id: mangaInfoParseObj.comic.slug,
                title: mangaInfoParseObj.comic.title,
                altTitles: mangaInfoParseObj.comic.md_titles.map((e: { title: string; }) => e.title,),
                slug: mangaInfoParseObj.comic.slug,
                url: `/manga/comick/title/${mangaInfoParseObj.comic.slug}`,
                description: mangaInfoParseObj.comic.desc,
                isNSFW: mangaInfoParseObj.comic.hentai,
                langlist: mangaInfoParseObj.langList,
                status: mangaInfoParseObj.comic.status == "1" ? "ongoing" : "completed",
                authors: mangaInfoParseObj.authors.map((e: { name: string; }) => e.name),
                genres: mangaInfoParseObj.comic.md_comic_md_genres.map((e: { md_genres: {name:string;} }) => e.md_genres.name),
                chapters: [],
                thumbnail: {
                    url: "https://meo.comick.pictures/" + mangaInfoParseObj.comic.md_covers[0].b2key
                },
    recommendations: mangaInfoParseObj.comic.recommendations.map((e: { relates: { title: string; slug: string; md_covers: { b2key: string; }[]; } }) => ({
    title: e.relates.title,
    slug: e.relates.slug,
           thumbnail: {
             url: "https://meo.comick.pictures/" + e.relates.md_covers[0]?.b2key
           }

}))

                
            }

            dataApi.data.chapters.map((e: { id: number; title: string; hid: string; chap: number; created_at: string; lang: string; }) => {
                const mindate = new Date(e.created_at);
                const langChapter = currentLang ? currentLang : "?lang=" + e.lang

                const MangaInfoChapter: MangaChapter = {
                    id: e.hid,
                    chapterId: `${e.hid}-${mangaInfoParseObj.comic.slug}-${e.chap ? e.chap : "err"}${langChapter}`,
                    title: e.title,
                    url: `/manga/comick/chapter/${e.hid}-${mangaInfoParseObj.comic.slug}-${e.chap ? e.chap : "err"}${langChapter}`,
                    number: e.chap,
                    images: null,
                    cover: null,
                    date: {
                        year: mindate.getFullYear() ? mindate.getFullYear() : null,
                        month: mindate.getMonth() ? mindate.getMonth() : null,
                        day: mindate.getDay() ? mindate.getDay() : null
                    }
                }
                return MangaInfo.chapters.push(!langChapter.includes("?lang=id") ? MangaInfoChapter : null)
            })

            return MangaInfo
        } catch (error) {
            console.log(error)
        }
    }

    async GetChapterInfo(manga: string, lang: string) {
        try {

            const currentLang = lang ? "-" + lang : "-en";
            const hid = manga.substring(0, manga.indexOf("-"));
            const idTitle = manga.substring(manga.indexOf("-") + 1);
            const idNumber = idTitle.substring(idTitle.lastIndexOf("-") + 1);
            const title = idTitle.substring(0, idTitle.lastIndexOf("-"));

            let urlchange = ""

            if (idNumber != "err") {
                urlchange = `${hid}-chapter-${idNumber}${currentLang}`
            } else {
                urlchange = hid
            }

            const { data } = await axios.get(`${this.url}/comic/${title}/${urlchange}`);
            const $ = cheerio.load(data);

            if (JSON.parse($("#__NEXT_DATA__").html()).isFallback == false) {
                const mangaChapterInfoParseObj = JSON.parse($("#__NEXT_DATA__").html()).props.pageProps
                const mindate = new Date(mangaChapterInfoParseObj.chapter.created_at);
                  const prevId = mangaChapterInfoParseObj.prev ? `${mangaChapterInfoParseObj.prev.hid}-${mangaChapterInfoParseObj.chapter.md_comics.slug}-${mangaChapterInfoParseObj.prev.chap}` : null;
                const nextId = mangaChapterInfoParseObj.next ? `${mangaChapterInfoParseObj.next.hid}-${mangaChapterInfoParseObj.chapter.md_comics.slug}-${mangaChapterInfoParseObj.next.chap}` : null;


                
                const MangaChapterInfoChapter: MangaChapter = {
                    id: mangaChapterInfoParseObj.chapter.hid,
                    chapterId: `${manga}`,
                 prevId: prevId!, // Here we use the non-null assertion operator
                nextId: nextId!, // Here we use the non-null assertion operator

                    title: mangaChapterInfoParseObj.seoTitle,
                    url: `/manga/comick/chapter/${manga}`,
                    number: mangaChapterInfoParseObj.chapter.chap,
                    images: mangaChapterInfoParseObj.chapter.md_images.map((e: { w: number; h: number; name: string; b2key: string; }) => {
                        return {
                            width: e.w,
                            height: e.h,
                            name: e.name,
                            image: "https://meo.comick.pictures/" + e.b2key
                        }
                    }),
                    cover: "https://meo.comick.pictures/" + mangaChapterInfoParseObj.chapter.md_comics.md_covers[0].b2key,
                    date: {
                        year: mindate.getFullYear() ? mindate.getFullYear() : null,
                        month: mindate.getMonth() ? mindate.getMonth() : null,
                        day: mindate.getDay() ? mindate.getDay() : null
                    }
                }
                return MangaChapterInfoChapter;

            } else {
                const buildid = JSON.parse($("#__NEXT_DATA__").html()).buildId
                const currentUrl = idNumber == "err" ? `${title}/${hid}.json?slug=${title}&chapter=${hid}` : `${title}/${hid}-chapter-${idNumber}${currentLang}.json?slug=${title}&chapter=${hid}-chapter-${idNumber}${currentLang}`
                const dataBuild = await axios.get(`${this.url}/_next/data/${buildid}/comic/${currentUrl}`);

                    const prevId = dataBuild.data.pageProps.prev ? `${dataBuild.data.pageProps.prev.hid}-${dataBuild.data.pageProps.chapter.md_comics.slug}-${dataBuild.data.pageProps.prev.chap}` : null;
                const nextId = dataBuild.data.pageProps.next ? `${dataBuild.data.pageProps.next.hid}-${dataBuild.data.pageProps.chapter.md_comics.slug}-${dataBuild.data.pageProps.next.chap}` : null;

                const mindate = new Date(dataBuild.data.pageProps.chapter.created_at);
              
                const MangaChapterInfoChapter: MangaChapter = {
                    id: dataBuild.data.pageProps.chapter.hid,
                    chapterId: `${manga}`,
                     prevId: prevId!, // Here we use the non-null assertion operator
                    nextId: nextId!, // Here we use the non-null assertion operator
                    title: dataBuild.data.pageProps.seoTitle,
                    url: `/manga/comick/chapter/${manga}`,
                    number: dataBuild.data.pageProps.chapter.chap,
                    images: dataBuild.data.pageProps.chapter.md_images.map((s: { w: number; h: number; name: string; b2key: string; }) => {
                        return {
                            width: s.w,
                            height: s.h,
                            name: s.name,
                            image: "https://meo.comick.pictures/" + s.b2key
                        }
                    }),
                    cover: "https://meo.comick.pictures/" + dataBuild.data.pageProps.chapter.md_comics.md_covers[0].b2key,
                    date: {
                        year: mindate.getFullYear() ? mindate.getFullYear() : null,
                        month: mindate.getMonth() ? mindate.getMonth() : null,
                        day: mindate.getDay() ? mindate.getDay() : null
                    }
                }

                return MangaChapterInfoChapter;

            }
        } catch (error) {
            console.log(error)
        }
    }

}


