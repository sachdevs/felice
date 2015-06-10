function cachedTable(tableName, columns) {
    if (!columns) {
        if (!localStorage.getItem(tableName)) {
            this.database = undefined;
            return;
        }
        this.database = JSON.parse(localStorage.getItem(tableName));
        this.tableName = tableName;
        this.columns = Object.keys(this.database.columns);
        this.rownumber = this.database.rownumber;
        return;
    }
    this.database = {};
    this.database.columns = {};
    this.tableName = tableName;
    this.columns = columns;
    this.rownumber = 0;
    this.database.rownumber = this.rownumber;
    for (var i = 0; i < this.columns.length; i++) {
        this.database.columns[this.columns[i]] = {};
        this.database.allrows = [];
    }
    localStorage.setItem(this.tableName, JSON.stringify(this.database));
}

cachedTable.prototype = {
    constructor: cachedTable,
    addRow: function(row) {
        if (row.length !== this.columns.length)
            throw "Invalid number of items for row, line 9 cachedTable.js";
        for (var i = 0; i < this.columns.length; i++) {
            if (!this.database.columns[this.columns[i]].hasOwnProperty(row[i]))
                this.database.columns[this.columns[i]][row[i]] = [];
            this.database.columns[this.columns[i]][row[i]].push(this.rownumber);
        }
        this.database.allrows.push(row);
        this.rownumber++;
        this.database.rownumber = this.rownumber;
        localStorage.setItem(this.tableName, JSON.stringify(this.database));
    },
    getRow: function(column, value) {
        if (!this.database.columns.hasOwnProperty(column))
            throw "column does not exist";
        if (!this.database.columns[column].hasOwnProperty(value))
            throw "value does not exist";
        var getRow = this.database.columns[column][value];
        var ret = [];
        for (var i = 0; i < getRow.length; i++) {
            ret.push(this.database.allrows[getRow[i]]);
        }
        return ret;
    },
    getRowIds: function(column, value) {
        if (!this.database.columns.hasOwnProperty(column))
            throw "column does not exist";
        if (!this.database.columns[column].hasOwnProperty(value))
            throw "value does not exist";
        return this.database.columns[column][value];
    },
    updateRows: function(column, value, columnToChange, valueToChange) {
        if (!this.database.columns.hasOwnProperty(columnToChange))
            throw "column does not exist";
        var _row = this.getRowIds(column, value);
        var column_id = Object.keys(this.database.columns).indexOf(columnToChange);
        for (var i = 0; i < _row.length; i++) {
            _value = this.database.allrows[_row[i]][column_id];
            this.database.allrows[_row[i]][column_id] = valueToChange;
            var tempRowNumber = this.database.columns[columnToChange]._value;
            delete this.database.columns[columnToChange]._value;
            this.database.columns[columnToChange][valueToChange] = tempRowNumber;
        }
        console.log(this.database);
        //         console.log(this.getRow('genre', 'plswork'));
        //THIS FUNCTION SUCKS. I NEED TO MAKE SOME SORT OF PRIMARY KEY
    },
    _log: function() {
        console.log(localStorage.getItem(this.tableName));
    },
    _clear: function() {
        localStorage.clear();
    }
};

// var hi = new cachedTable('lol', ['a', 'b', 'c']);

// function addandlog(callback) {
//     hi.addRow(['k', 'l', 'i']);
//     hi.addRow(['a', 'x', 'l']);
//     hi.addRow(['b', 'a', 'd']);
//     hi.addRow(['c', 'b', 'f;']);
//     hi.addRow(['d', 'c', 'g']);
//     hi.addRow(['e', 'd', 'h']);
//     hi.addRow(['f', 'e', 'k']);
//     hi._log();
//     hi.getRow('a', 'a');
//     callback('done');
// }

// function goo() {
//     addandlog(function(ret) {
//         var trial = new cachedTable('lol');
//         trial._log();
//     });
// }
// goo();
