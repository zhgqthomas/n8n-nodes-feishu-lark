import ModuleLoadUtils from "../nodes/help/utils/moduleLoadUtils";

const path = __dirname + '/../dist/nodes/WechatOfficialAccountNode/resource'
console.log(ModuleLoadUtils.loadModules(path, '*.js'));


