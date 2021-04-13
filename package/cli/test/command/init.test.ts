/// <reference types="@types/jest" />
/// <reference types="@types/node" />
const cp = require('child_process');
const memfs = require('memory-fs');

Object.defineProperty(process, 'cwd', {
    value: () => "/"
})

beforeEach(() => {
    jest.resetModules();
});

it('project existed', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    fs.writeFileSync("/package.json", JSON.stringify({ puerts: { project: true } }))
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    const spy = jest.spyOn(cp, 'spawn');

    try {
        await init("unity", { install: 'false' });
        expect(false)

    } catch (e) {
        expect(spy).not.toHaveBeenCalled();
        expect(e.message).toBe('there is already a puerts project in this directory')
    }
})

it('input unity and expect unity', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    await init("unity", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unity');
    expect(puertsConfig.project)
})

it('input unity, expect UE and confirm', async () => {
    const fs = new memfs();
    fs.writeFileSync('/puerts.uproject', "whatever")
    jest.doMock('fs', () => fs);

    const mockPrompt = jest.fn(() => {
        return {
            sure: true
        }
    })
    jest.doMock('inquirer', () => ({
        prompt: mockPrompt
    }))

    const init = require('../../command/init');

    await init("unity", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unity');
    expect(puertsConfig.project)
    expect(mockPrompt).toHaveBeenCalled();
})

it('input unity, expect UE and aborted', async () => {
    const fs = new memfs();
    fs.writeFileSync('/puerts.uproject', "whatever")
    jest.doMock('fs', () => fs);

    const mockPrompt = jest.fn(() => {
        return {
            sure: false
        }
    })
    jest.doMock('inquirer', () => ({
        prompt: mockPrompt
    }))

    const init = require('../../command/init');

    await expect(init("unity", { install: 'false' })).rejects.toThrow('aborted')
    expect(mockPrompt).toHaveBeenCalled();
})

it('invalid project', async () => {
    const fs = new memfs();
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    await expect(init('', {})).rejects.toThrow('auto detect the engine type failed')
})

it('install project', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    jest.doMock('fs', () => fs);

    const exec = jest.fn(() => ({
        stdout: { on: () => { } },
        stderr: { on: () => { } },
        on: (ev, callback) => setTimeout(callback, 500)
    }))
    jest.doMock('child_process', () => {
        return {
            exec
        }
    })

    const init = require('../../command/init');

    await init("unity", {})

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unity');
    expect(puertsConfig.project)

    expect(exec).toHaveBeenCalled();
})


it('input ue and expect ue', async () => {
    const fs = new memfs();
    fs.writeFileSync('/puerts.uproject', "whatever")
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    await init("ue", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unreal');
    expect(puertsConfig.project)
})


it('input ue, expect unity and confirm', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    jest.doMock('fs', () => fs);

    const mockPrompt = jest.fn(() => {
        return {
            sure: true
        }
    })
    jest.doMock('inquirer', () => ({
        prompt: mockPrompt
    }))

    const init = require('../../command/init');

    await init("unreal", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unreal');
    expect(puertsConfig.project)
    expect(mockPrompt).toHaveBeenCalled();
})

it('input unity, expect UE and aborted', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    jest.doMock('fs', () => fs);

    const mockPrompt = jest.fn(() => {
        return {
            sure: false
        }
    })
    jest.doMock('inquirer', () => ({
        prompt: mockPrompt
    }))

    const init = require('../../command/init');

    await expect(init("unreal", { install: 'false' })).rejects.toThrow('aborted')
    expect(mockPrompt).toHaveBeenCalled();
})

it('input nothing and expect ue', async () => {
    const fs = new memfs();
    fs.writeFileSync('/puerts.uproject', "whatever")
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    await init("", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unreal');
    expect(puertsConfig.project)
})
it('input nothing and expect unity', async () => {
    const fs = new memfs();
    fs.mkdirSync("/Assets");
    jest.doMock('fs', () => fs);

    const init = require('../../command/init');

    await init("", { install: 'false' })

    const puertsConfig = JSON.parse(fs.readFileSync('/package.json')).puerts;

    expect(puertsConfig.engine).toBe('unity');
    expect(puertsConfig.project)
})
