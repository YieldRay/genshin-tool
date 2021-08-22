module.exports = (...args) => {
    const required = [];
    args.forEach(([variable, name]) => {
        if (variable === null) required.push(name);
    });
    if (required.length > 0) throw new Error(`${required.join(",")} is required`);
};
// 检查多个变量是否为null，存在null则报错
