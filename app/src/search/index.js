import { Service } from "../service"
import _ from "lodash"

export const Search = {

    company: async (search) => {
        return (await new Service().Post("search/company", {search}, undefined, false))?.data
    },

    calledReason: async (search) => {
        return (await new Service().Post("search/called-reason", {search}, undefined, false))?.data
    },

    calledOccurrence: async (search) => {
        return (await new Service().Post("search/called-occurrence", {search}, undefined, false))?.data
    },

    calledStatus: async (search) => {
        return (await new Service().Post("search/called-status", {search}, undefined, false))?.data
    },

    user: async (search) => {
        return (await new Service().Post("search/user", {search}, undefined, false))?.data
    },

    role: async (search) => {
        return (await new Service().Post("search/role", {search}, undefined, false))?.data
    },

    city: async (search) => {
        return (await new Service().Post("search/city", {search}, undefined, false))?.data
    },

    partner: async (search) => {
        return (await new Service().Post("search/partner", {search}, undefined, false))?.data
    },

    sender: async (search) => {
        return (await new Service().Post("search/sender", {search}, undefined, false))?.data
    },

    recipient: async (search) => {
        return (await new Service().Post("search/recipient", {search}, undefined, false))?.data
    },

    bankAccount: async (search) => {
        return (await new Service().Post("search/bank-account", {search}, undefined, false))?.data
    },

    contabilityCategorie: async (search) => {
        return (await new Service().Post("search/contability-categorie", {search}, undefined, false))?.data
    },

    receivementMethod: async (search) => {
        return (await new Service().Post("search/receivement-method", {search}, undefined, false))?.data
    },

    taskMethod: async (search) => {
        return (await new Service().Post("search/task-method", {search}, undefined, false))?.data
    },

    cfop: async (search) => {
        return (await new Service().Post("search/cfop", {search}, undefined, false))?.data
    },

}