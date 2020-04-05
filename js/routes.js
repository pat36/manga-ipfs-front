let Home = {
    view: function(vnode) {
        document.querySelector("#app").innerHTML = "";
        getData(url, function(data) {
            for(let i = data.length-1; i>=0 && i > data.length-21; i--) {
                document.querySelector("#app").innerHTML += `<a href="${path}#!/g/${i+1}"><img src="${gateway+data[i].pages[0]}" width="250" height="358" /></a>`
            }
            document.querySelector("#app").innerHTML += `<p><a href = "/#!/g/all">All mangas</a></p>`
        });
    }
}
let Gallery = {
    view: function(vnode) {
        document.querySelector("#app").innerHTML = "";
        if(vnode.attrs.gallery_id === "all") {
            getData(url, function(data) {
                document.querySelector("#app").innerHTML += "All mangas:<br>";
                for(let i = 0; i < data.length; i++) {
                    document.querySelector("#app").innerHTML += 
                        "<ul>" +
                        `<li><a href="/#!/g/${data[i].id}">${data[i].series_name}<a></li>` +
                        "</ul>";
                }
            });
        }
        let g_id = parseInt(vnode.attrs.gallery_id) - 1;
        getData(url, function(data) {
            for(let i = 0; i < data[g_id].pages.length; i++) {
                if(i%4 == 0) document.querySelector("#app").innerHTML += "<br>";
                document.querySelector("#app").innerHTML += `<a href="${path}#!/g/${g_id+1}/page/${i+1}" style="margin: 5px; margin-top:5px;"><img src="${gateway+data[g_id].pages[i]}" width="250" height="358" /></a>`
            }
        });          
    }
}
let Page = {
    view: function(vnode) {
        document.querySelector("#app").innerHTML = "";
        const g_id = vnode.attrs.gallery_id;
        const p_id = vnode.attrs.page_id;
        let next_page = parseInt(p_id) + 1;
        let previous_page = parseInt(p_id) - 1;
        getData(url, function(data) {
            if(previous_page < 1) previous_page = parseInt(data[g_id-1].pages.length) - 1;
            if(next_page > data[g_id-1].pages.length-1) next_page = 1;
            document.querySelector("#app").innerHTML += 
                `<a href="${path}#!/g/${g_id}/page/${next_page}"><img src="${gateway+data[g_id-1].pages[p_id-1]}" width="50%" height="50%" /></a><br>` +
                `<span id="page_nav">` +
                `<a href="${path}#!/g/${g_id}/page/${previous_page}"><i style="font-size: 3em">&larr;</i></a>` +
                `<a href="${path}#!/g/${g_id}"><i style="font-size: 3em">&uarr;</i></a>` +
                `<a href="${path}#!/g/${g_id}/page/${next_page}"><i style="font-size: 3em">&rarr;</i></a>` +
                `</span>`;
        });
    }
}