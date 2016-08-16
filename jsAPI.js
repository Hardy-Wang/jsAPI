//通用API，扩展js底层方法
/*
	string
		contains	        包含
        capitalize          首字母大写
        uncapitalize        首字母小写
        dateParse           日期格式字符串转换为日期类型
        trim                去掉首尾空格（包括中文和英文）
        startWith           是否以指定字符开始
        endWith             是否以指定字符结束   
        format              格式化字符串
        repeat              重复
        eval                根据链接表达式获取实际值
        reverse             反转字符串
	array
        isEmpty             判断数组是否为空，数组中所有项都为undefined|null|""
        indexOf             获取item在数组中的索引，未找到返回-1
        contains	        数组中是否包含item
        remove              从数组中删除item
        toMap               将数组中item对象的属性作为key，item对象作为value，组成一个map
        attributed          从对象数组中取出每个对象的一个属性值组成新数组
        join                重写join方法，追加连接对象属性值的功能
        eval                 
        distinct            去重复
        each                each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
        uniquelize          得到一个数组不重复的元素集合
        minus               求两个集合的差集
        intersect           求两个集合的交集
        union               求两个集合的并集        
        complement          求两个集合的补集              
        clone               克隆          
        find                查找         
        finds               查找         
    number
        to45                通过四舍五入转换                            
    date
        pattern                            
        simplify                         
        withRegexpKey                         
    DOM
*/

(function () {
	//string 
	
    /**包含*/
    String.prototype.contains = function (string) {
        return this.indexOf(string) != -1;
    };
    /**首字母大写*/
    String.prototype.capitalize = function () {
        return this.replace(/(^|\s+)\w/g, function (s) {
            return s.toUpperCase();
        });
    };
    /**首字母小写*/
    String.prototype.uncapitalize = function () {
        return this.replace(/(^|\s+)\w/g, function (s) {
            return s.toLowerCase();
        });
    };

    /**
     * 日期格式字符串转换为日期类型
     */
    String.prototype.dateParse = function () {
        return new Date(Date.parse(this.replace(/-/g, "/")));
    };

    /**
     * 去掉首尾空格（包括中文和英文）
     */
    String.prototype.trim = function () {
        if (/^([ | ]*)(.*)([ | ]*)$/.test(this)) {
            return RegExp.$2;
        }
        return this;
    };

    /**
     * 是否以指定字符开始
     * @param pre 前缀
     * @returns boolean
     */
    String.prototype.startWith = function (pre) {
        return new RegExp("^(" + pre + ")(.*)").test(this);
    };

    /**
     * 是否以指定字符结束
     * @param suf 后缀
     * @returns boolean
     */
    String.prototype.endWith = function (suf) {
        return new RegExp("(.*)(" + suf + ")$").test(this);
    };

    /**给undefined值设置一个默认值*/
    var _undefinedDefault = function (value, defaults) {return value == undefined ? defaults : value;};
    /**
     * 格式化字符串
     * 1.支持{}占位符
     * @returns {string}
     */
    String.prototype.format = function () {
        var _args = arguments;
        var object = _args[0];
        return typeof object == "object" ?
            this.replace(/\{(\w+(\.\w+)*)}/g, function (matched, name) {return _undefinedDefault(name.eval(object), matched);}) :
            this.replace(/\{(\d+)}/g, function (matched, index) {return _undefinedDefault(_args[index], matched);});
    };

    /**
     * 重复
     * @param time 次数
     * @returns {*|string}
     */
    String.prototype.repeat = function (time) {
        return new Array(time + 1).join(this);
    };

    /**
     * 根据链接表达式获取实际值
     * 例如:"a.a.a.a".eval({a:{a:{a:'a'}}})=a
     * @param domain 范围域
     * @param value
     * @returns {*}
     */
    String.prototype.eval = function (domain, value) {
        if (value === undefined) {
            if (domain === undefined) {return null;}
            try {
                return eval("domain" + "." + this);
            } catch (e) {
                return null;
            }
        }
        return this.split(".").eval(domain, value);
    };

    /**
     * 反转字符串
     * @returns {string} 反转后的字符串
     */
    String.prototype.reverse = function () {
        return this.split("").reverse().join("");
    };


    var _isEmpty = function (item) {return item === undefined || item === null || item === "";};
    /**判断数组是否为空，数组中所有项都为undefined|null|""*/
    Array.prototype.isEmpty = function (isEmpty) {
        isEmpty = isEmpty || _isEmpty;
        for (var i = 0; i < this.length; i++) {
            if (!isEmpty(this[i])) {return false;}
        }
        return true;
    };

    /**获取item在数组中的索引，未找到返回-1*/
    Array.prototype.indexOf = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == item || (this[i] && this[i].equals && this[i].equals(item))) return i;
        }
        return -1;
    };

    /**数组中是否包含item*/
    Array.prototype.contains = function (item) {
        return this.indexOf(item) != -1;
    };

    /**从数组中删除item*/
    Array.prototype.remove = function (item) {
        var index = this.indexOf(item);
        index !== -1 && this.splice(index, 1);
        return this;
    };

    /**将数组中item对象的属性作为key，item对象作为value，组成一个map*/
    Array.prototype.toMap = function (name) {
        var map = {};
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            map[item[name]] = item;
        }
        return map;
    };

    /**将数组中的所有项转换为小写*/
    Array.prototype.toLowerCase = function () {
        for (var i = 0; i < this.length; i++) {
            this[i] = this[i].toLowerCase();
        }
        return this;
    };

    /** 从对象数组中取出每个对象的一个属性值组成新数组 */
    Array.prototype.attributed = function (attr) {
        var values = [];
        for (var i = 0; i < this.length; i++) {
            values.push(this[i][attr]);
        }
        return values;
    };

    var join = Array.prototype.join;
    /** 重写join方法，追加连接对象属性值的功能 */
    Array.prototype.join = function (sep, attr) {
        if (typeof attr !== "string") {
            return join.call(this, sep);
        }
        return join.call(this.attributed(attr), sep);
    };


    Array.prototype.eval = function (domain, value) {
        //获取值
        if (value === undefined) {
            return this.join(".").eval(domain);
        }

        //设置值
        var _domain = domain;
        for (var i = 0; i < this.length; i++) {
            var key = this[i];
            if (i == this.length - 1) {
                _domain[key] = value;
            } else {
                var isPrimitive = /undefined|boolean|number|string/.test(_domain[key]) || _domain[key] === null;
                if (isPrimitive) {_domain[key] = {};}
                _domain = _domain[key];
            }
        }
        return domain;
    };

    /**去重复*/
    Array.prototype.distinct = function () {
        var clone, newArr = [], n = 0;
        if (this.length < 2)return;
        clone = this;
        for (var i = 0, len = this.length; i < len; i++) {
            for (var j = i + 1, len2 = clone.length; j < len2; j++) {
                if (this[i] !== clone[j]) {
                    n++;
                }
            }
            if (n == (len - i - 1)) {
                newArr.push(this[i])
            }
            n = 0;
        }
        return newArr;
    }


    /**
     * each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
     * 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
     * @param {Function} fn 进行迭代判定的函数
     * @param more ... 零个或多个可选的用户自定义参数
     * @returns {Array} 结果集，如果没有结果，返回空集
     */
    Array.prototype.each = function (fn) {
        fn = fn || Function.K;
        var a = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var res = fn.apply(this, [this[i], i].concat(args));
            if (res != null) a.push(res);
        }
        return a;
    };

    /**
     * 得到一个数组不重复的元素集合<br/>
     * 唯一化一个数组
     * @returns {Array} 由不重复元素构成的数组
     */
    Array.prototype.uniquelize = function () {
        var uniques = [];
        for (var i = 0; i < this.length; i++) {
            if (!uniques.contains(this[i])) {
                uniques.push(this[i]);
            }
        }
        return uniques;
    };

    /**
     * 求两个集合的差集
     * @param {Array} array 另一个数组
     * @returns {Array} 两个集合的差集
     */
    Array.prototype.minus = function (array) {
        return this.each(function (item) {return array.contains(item) ? null : item});
    };

    /**
     * 求两个集合的交集
     * @param {Array} array 集合B
     * @returns {Array} 两个集合的交集
     */
    Array.prototype.intersect = function (array) {
        return this.each(function (item) {return array.contains(item) ? item : null});
    };

    /**
     * 求两个集合的并集
     * @param {Array} array 集合B
     * @returns {Array} 两个集合的并集
     */
    Array.prototype.union = function (array) {
        return this.concat(array).uniquelize();
    };

    /**
     * 求两个集合的补集
     * @param {Array} array 集合B
     * @returns {Array} 两个集合的补集
     */
    Array.prototype.complement = function (array) {
        return this.union(array).minus(this.intersect(array));
    };


    /**
     * 克隆
     * 根据属性名指定的属性创建新对象
     * @param {Array}array
     * @param {Array|Object}filter 过滤属性
     * @returns {Array}
     */
    Array.clone = function (array, filter) {
        var clone = [];
        for (var i = 0; i < array.length; i++) {
            clone.push(Object.clone(array[i], filter));
        }
        return clone;
    };


    /**
     * 查找
     * 根据属性名和属性值的匹配
     * @param {Array}array 数值
     * @param {Object}match 匹配对象
     * @returns {Object}对象
     */
    Array.find = function (array, match) {
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            if (Object.containsObject(object, match)) {
                return object;
            }
        }
        return null;
    };

    /**
     * 查找
     * 根据属性名和属性值的匹配
     * @param {Array}array 数值
     * @param {Object}match 匹配对象
     * @returns {Object}对象
     */
    Array.finds = function (array, match) {
        var targets = [];
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            if (Object.containsObject(object, match)) {
                targets.push(object);
            }
        }
        return targets;
    }

    /**
     * 通过四舍五入转换
     * @param precision 精度，保留的有效小数位数
     * @returns {number}
     */
    Number.prototype.to45 = function (precision) {
        var number = Math.pow(10, precision);
        return Math.round(this * number) / number;
    };
   

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
     * Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
     * Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
     * Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
     * Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
     * Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    Date.YEAR = 1;
    Date.MONTH = 2;
    Date.DATE = 3;
    Date.HOUR = 4;
    Date.MINUTE = 5;
    Date.SECOUND = 6;


    var methods = {};
    methods[Date.YEAR] = {
        get: Date.prototype.getFullYear,
        set: Date.prototype.setFullYear
    };
    methods[Date.MONTH] = {
        get: Date.prototype.setMonth,
        set: Date.prototype.getMonth
    };
    methods[Date.DATE] = {
        get: Date.prototype.getDate,
        set: Date.prototype.setDate
    };
    methods[Date.HOUR] = {
        get: Date.prototype.getHours,
        set: Date.prototype.setHours
    };
    methods[Date.MINUTE] = {
        get: Date.prototype.getMinutes,
        set: Date.prototype.setMinutes
    };
    methods[Date.SECOUND] = {
        get: Date.prototype.getSecounds,
        set: Date.prototype.setSecounds
    };

    Date.prototype.add = function (unit, number) {
        var method = methods[unit];
        method.set.call(this, method.get.call(this) + number);
        return this;
    };

    /**
     * 简化，将this时间按照date进行简化，省略相同的单元，以‘()’作为单元的分隔符
     * etc：new Date().simplify("(yyyy年)(MM月)(dd日)(hh时)(mm分)(ss秒)",new Date())=2010年1月1日01时01分01秒、1月1日01时01分01秒、1日01时01分01秒
     * @param pattern 格式
     * @param date 当前日期
     */
    Date.prototype.simplify = function (pattern, date) {
        var _this = this.withRegexpKey();
        var _date = date.withRegexpKey();
        for (var attr in _this) {
            //单元值不相同，去掉pattern中多余的(和)
            if (_this[attr] != _date[attr]) {
                return this.pattern(pattern.replace(/\(|\)/g, ""));
            }

            //单元值相同，去掉单元值对应的规则
            var _pattern = "(\\([^)]*{0}[^)]*\\))".format(attr);
            if (new RegExp(_pattern).test(pattern)) {
                pattern = pattern.replace(RegExp.$1, "");
            }
        }
    };

    /**将日期转换为一个对象，以单元的正则表达式作为对象的键，单元对应的值作为对象的值*/
    Date.prototype.withRegexpKey = function () {
        return {
            "y+": this.getFullYear(), //年份
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
    };

/**表格*/
var Table = {
    /**
     * 求表格的列数
     *
     * @param {HTMLTableElement} table
     * @returns {number} 表格列数
     */
    colsCount: function (table) {
        var rows = table.rows;
        if (!rows || rows.length == 0) {
            return 0;
        }

        var colsCount = 0;
        var first = rows[0];
        var cells = first.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            colsCount += cell.colSpan || 1;
        }
        return colsCount;
    }
};

function Size(value, unit) {
    this.value = value;
    this.unit = unit;
}

Size.property = {
    to: function (unit) {

    }
};

/**内存大小*/
var MemorySize = {
    units: ["B", "KB", "MB", "GB", "TB"],
    parse: function (size) {
        var parts = size.match("(\d+)(" + this.units.join("|") + ")");
        return {size: parts[1], units: parts[2]};
    },
    toSuper: function (size, unit) {

    },
    toUnit: function (size, unit) {
        unit = unit || "MB";


    },
    /**转换成合适单位的描述*/
    toString: function (size) {
        if (size < 1024) {
            return size + "B";
        }

        size = size / 1024;
        if (size < 1024) {
            return size + "KB";
        }

        size = size / 1024;
        if (size < 1024) {
            return size + "MB";
        }

        size = size / 1024;
        if (size < 1024) {
            return size + "GB";
        }

        size = size / 1024;
        return size + "TB";
    }
};

})();
