const service = require("../../services/github-actions")
const utils = require("../../utils")

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    getConfig: jest.fn(),
}));

describe("test workflow populate with config", () => {
    describe("when hasEnvPat is false", () => {
        it("should return initial workflow", (done) => {
            utils.getConfig.mockReturnValue({
                hasEnvPat: false,
                pats: {}
            })
            const workflow = {
                name: "some_workflow_name",
                pat: "some pat"
            }
            const result = service.populateWorkflowWithEnvPat(workflow)

            expect(result).toEqual(workflow)
            done()
        })
    })
    describe("when hasEnvPat is true", () => {
        describe("when config is defined but the workflow name doesn't match the config name", () => {

            it("should return initial workflow", (done) => {
                utils.getConfig.mockReturnValue({
                    hasEnvPat: true,
                    pats: {
                        some_other_workflow_name: "some other pat"
                    }
                })
                const workflow = {
                    name: "some_workflow_name",
                    pat: "some pat"
                }
                const result = service.populateWorkflowWithEnvPat(workflow)

                expect(result).toEqual(workflow)
                done()
            })
        })
        describe("when config is defined and the workflow name match the config name", () => {

            it("should return initial workflow", (done) => {
                utils.getConfig.mockReturnValue({
                    hasEnvPat: true,
                    pats: {
                        some_workflow_name: "some other pat"
                    }
                })
                const workflow = {
                    name: "some_workflow_name",
                    pat: "some pat"
                }
                const result = service.populateWorkflowWithEnvPat(workflow)

                expect(result).toEqual({ ...workflow, pat: "some other pat" })
                done()
            })
        })
    })
})