let db = openDatabase('hashes', '1.0', 'Database of ipfq hashes', 2*1024*1024);
let path = window.location.pathname;
let gateway = window.location.origin+"/ipfs/";
let hash = "";
let url = `${gateway+hash}`;
let db_number = 1;

let getData = (url, callback) => {
    fetch(url).then((res) => {
        return res.json();
    }).then((json) => {
        return callback(json);
    });
};

let selectRow = (query, callback) => {
    let db = openDatabase('hashes', '1.0', 'Database of ipfq hashes', 2*1024*1024);
    db.transaction((tx) => { 
        tx.executeSql(query, [], (tx, rs) => {
            let result = [];
            for(let i = 0; i < rs.rows.length; i++) {
                let row = rs.rows.item(i);
                result[i] = { name: row['hash'], defaultHash: row['defaultHash']}
            }
            callback(result);
        });
    });
}

let changeHash = (newHash) => {
    hash = newHash;
    changeUrl(gateway, hash);
};
let changeUrl = (_gateway, _hash) => {
    url = `${_gateway+_hash}`;
};

let db_selector_generate = () => {
    let sel = document.querySelector("#db_change");
    sel.innerHTML = "";
    selectRow("SELECT * FROM hashes", function(res) {
        for(let i = 0; i < res.length; i++) {
            sel.innerHTML += `<option value = "${parseInt(i)+1}">${res[i].name}</option>`;
        }
    });
};

let db_select = () => {
    selectRow(`SELECT * FROM hashes WHERE rowid=${db_number}`, (res) => {
        changeHash(res[0].name);
        Home.view();
    });
    db_selector_generate();
};

let db_select_selector = (val) => {
    db_number = parseInt(val);
    db_select();
};

function changeDatabase(hash) {
    db.transaction(function(tx) {
        tx.executeSql(`INSERT INTO hashes(hash) VALUES ('${hash}')`)
    })
    db_selector_generate();
}
// iterating over json object: 
// for(let i = 0; i < json.length; i++) {
//     for(let j = 0; j < json[i].pages.length; j++) {
//         console.log(json[i].pages[j])
//     }
// }

// hashes
// sfw: QmUw3xviDCfsgXX7qdipSkpS5X8V5kfVzxTuAWQasoYYX7
// nsfw: QmNhHspzusAC4sXjjGx9BaNLVEhnsHMGLH6V7AzmRPYGZp