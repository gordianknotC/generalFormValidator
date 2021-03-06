//@ts-ignore
import v8n from "v8n";
//@ts-ignore
import emailValidator from 'email-validator';
import { assert } from "common_js_builtin/dist/utils/assert";
import { useBuiltIn } from "common_js_builtin/dist/base/builtinTypes";
useBuiltIn();
export var EBaseValidationRules;
(function (EBaseValidationRules) {
    EBaseValidationRules["allUserPattern"] = "allUserPattern";
    EBaseValidationRules["bail"] = "bail";
    EBaseValidationRules["greater"] = "greater";
    EBaseValidationRules["lesser"] = "lesser";
    EBaseValidationRules["confirm"] = "confirm";
    EBaseValidationRules["email"] = "email";
    EBaseValidationRules["remark"] = "remark";
    EBaseValidationRules["notEqual"] = "notEqual";
    EBaseValidationRules["optional"] = "optional";
    EBaseValidationRules["phone"] = "phone";
    EBaseValidationRules["pwdLength"] = "pwdLength";
    EBaseValidationRules["pwdPattern"] = "pwdPattern";
    EBaseValidationRules["required"] = "required";
    EBaseValidationRules["searchLength"] = "searchLength";
    EBaseValidationRules["nickLength"] = "nickLength";
    EBaseValidationRules["userLength"] = "userLength";
    EBaseValidationRules["amountLength"] = "amountLength";
    EBaseValidationRules["userPattern"] = "userPattern";
    EBaseValidationRules["decimalPattern"] = "decimalPattern";
    EBaseValidationRules["intPattern"] = "intPattern";
})(EBaseValidationRules || (EBaseValidationRules = {}));
// 00311  12344
const PWD_PATTERN = /[a-zA-Z0-9#_\-]+/g;
const USER_PATTERN = /[a-zA-Z0-9\-]+/g;
const ALL_USER_PATTERN = /[a-zA-Z0-9_\-]+/g;
const DECIMAL_PATTERN = /([1-9][0-9\/.,]*[0-9]$)|([0-9])/g;
const INT_PATTERN = /([1-9][0-9,]*[0-9]$)|([0-9])/g;
v8n.extend({
    pattern(expect) {
        return function (value) {
            if (expect.global) {
                const matches = [...value.matchAll(expect)];
                return matches.first[0].length == value.length;
                // console.log('1match pattern...', result);
                // return result;
            }
            else {
                return value.test(expect);
                // console.log('2match pattern...', result);
                // return result;
            }
        };
    }
});
const E = EBaseValidationRules;
export const baseFieldRules = {
    username: `required|${E.userLength}|${E.userPattern}`,
    nickname: `required|${E.nickLength}|${E.userPattern}`,
    password: `required|${E.pwdLength}|${E.pwdPattern}`,
    newPassword: `required|${E.notEqual}|${E.pwdLength}|${E.pwdPattern}`,
    confirmPassword: "required|confirm",
    remark: "optional",
    allUsername: `bail|${E.allUserPattern}|${E.userLength}`,
    searchField: `bail|${E.userLength}|${E.userPattern}`,
    phone: `required|${E.phone}`,
    email: `required|${E.email}`,
    referral_code: "optional",
};
export function aRule(rules) {
    return rules.join("|");
}
/** ??????????????? vue_formula, ???????????? vue_formula*/
export const baseValidationRules = {
    /** ??? rule*/
    [EBaseValidationRules.optional](ctx, ...args) {
        return true;
    },
    /** ??????*/
    [EBaseValidationRules.required](ctx, ...args) {
        return v8n().not.empty().test(ctx.value);
    },
    /** ????????????????????? */
    [EBaseValidationRules.bail](ctx, ...args) {
        ctx.displayOption.showMultipleErrors = true;
        return true;
    },
    /** ?????????????????????(????????????????????????) 8-30???*/
    [EBaseValidationRules.pwdPattern](ctx, ...args) {
        return v8n()
            .pattern(PWD_PATTERN)
            .test(ctx.value);
    },
    /**8-30???*/
    [EBaseValidationRules.pwdLength](ctx, ...args) {
        return v8n()
            .length(8, 30)
            .test(ctx.value);
    },
    /** ??????????????? sampleField_confirm, ?????????????????? ????????? sampleFIeld */
    [EBaseValidationRules.confirm](ctx, ...args) {
        const name = ctx.name;
        const targetName = name.split('_confirm').first;
        const targetField = ctx.model.getFieldByFieldName(targetName);
        const targetVal = targetField.value;
        ctx.model.linkFields({
            master: { name: ctx.name, dataKey: ctx.dataKey },
            slave: { name: targetField.name, dataKey: targetField.dataKey }
        });
        console.log('name:', name, 'val:', ctx.value, 'targetName', targetName, 'targetVal:', targetVal, 'model:', ctx.model);
        return targetVal == ctx.value;
    },
    /** ????????? confirm ????????????????????? field name suffixed with _notEqual
     *  ???????????? prefix ??? notEqual ???????????????
     * */
    [EBaseValidationRules.notEqual](ctx, ...args) {
        const name = ctx.name;
        const targetName = name.split('_notEqual').first;
        const targetField = ctx.model.getFieldByFieldName(targetName);
        const targetVal = targetField.value;
        ctx.model.linkFields({
            master: { name: ctx.name, dataKey: ctx.dataKey },
            slave: { name: targetField.name, dataKey: targetField.dataKey }
        });
        console.log('name:', name, 'val:', ctx.value, 'targetName', targetName, 'targetVal:', targetVal, 'model:', ctx.model);
        return targetVal != ctx.value;
    },
    [EBaseValidationRules.email](ctx, ...args) {
        return emailValidator.validate(ctx.value);
    },
    [EBaseValidationRules.phone](ctx, ...args) {
        ctx.value = args[1].number;
        return args[1].isValid;
    },
    /** ??????????????????????????? */
    [EBaseValidationRules.userPattern](ctx, ...args) {
        return v8n()
            .pattern(USER_PATTERN)
            .test(ctx.value);
    },
    [EBaseValidationRules.decimalPattern](ctx, ...args) {
        return v8n()
            .pattern(DECIMAL_PATTERN)
            .test(ctx.value);
    },
    [EBaseValidationRules.intPattern](ctx, ...args) {
        return v8n()
            .pattern(INT_PATTERN)
            .test(ctx.value);
    },
    [EBaseValidationRules.amountLength](ctx, ...args) {
        return v8n()
            .length(4, 10)
            .test(ctx.value);
    },
    /** ???????????????????????????????????????????????????????????? */
    [EBaseValidationRules.allUserPattern](ctx, ...args) {
        return v8n()
            .pattern(ALL_USER_PATTERN)
            .test(ctx.value);
    },
    /**  5-30???*/
    [EBaseValidationRules.userLength](ctx, ...args) {
        return v8n()
            .length(5, 30)
            .test(ctx.value);
    },
    [EBaseValidationRules.nickLength](ctx, ...args) {
        return v8n()
            .length(1, 10)
            .test(ctx.value);
    },
    /**  3???*/
    [EBaseValidationRules.searchLength](ctx, ...args) {
        const val = ctx.value;
        const arr = val.toAsciiArray();
        return arr.length >= 3 || arr.length == 0;
    },
    [EBaseValidationRules.remark](ctx, ...rags) {
        return v8n()
            .length(0, 100)
            .test(ctx.value);
    },
    // untested:
    [EBaseValidationRules.greater](ctx, ...args) {
        const name = ctx.name;
        const lidx = name.lastIndexOf("_lesser");
        const targetName = name.substring(0, lidx);
        const targetField = ctx.model.getFieldByFieldName(targetName);
        const targetVal = Number(targetField.value);
        ctx.model.linkFields({
            master: { name: ctx.name, dataKey: ctx.dataKey },
            slave: { name: targetField.name, dataKey: targetField.dataKey }
        });
        if (isNaN(Number(ctx.value))) {
            console.log("ctx:", ctx);
            ctx.value = 0;
        }
        console.log(`${name}-${targetName}`, "targetName:", targetName, "targetVal:", targetVal, "value:", ctx.value, "targetVal < ctx.value", targetVal < ctx.value);
        return targetVal < ctx.value;
    },
    // untested:
    [EBaseValidationRules.lesser](ctx, ...args) {
        const name = ctx.name;
        const lidx = name.lastIndexOf("_lesser");
        const targetName = name.substring(0, lidx);
        const targetField = ctx.model.getFieldByFieldName(targetName);
        const targetVal = Number(targetField.value);
        ctx.model.linkFields({
            master: { name: ctx.name, dataKey: ctx.dataKey },
            slave: { name: targetField.name, dataKey: targetField.dataKey }
        });
        if (isNaN(Number(ctx.value))) {
            ctx.value = 0;
        }
        console.log(`${name}-${targetName}`, "targetVal:", targetVal, "value:", ctx.value, "targetVal > ctx.value", targetVal > ctx.value);
        return targetVal > ctx.value;
    },
};
export function addValidationRule(ruleName, handler, override = false) {
    if (!override)
        assert(!Object.keys(EBaseValidationRules).any((_) => _ === ruleName), `Rule: ${ruleName} already defined, to ignore this message set override to "true" explicitly`);
    baseValidationRules[ruleName] = handler;
    //@ts-ignore
    EBaseValidationRules[ruleName] = ruleName;
    return ruleName;
}
export function addFieldRule(fieldName, rule, override = false) {
    if (!override)
        assert(!Object.keys(EBaseValidationRules).any((_) => _ === fieldName), `Rule: ${fieldName} already defined, to ignore this message set override to "true" explicitly`);
    //@ts-ignore
    baseFieldRules[fieldName] = rule;
    return baseFieldRules;
}
export function getValidationRules() {
    return baseValidationRules;
}
export function getFieldRules() {
    return baseFieldRules;
}
//# sourceMappingURL=formRuleUtil.js.map