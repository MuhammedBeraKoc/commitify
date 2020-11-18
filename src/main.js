import chalk from 'chalk'
import execa from 'execa'
import Listr from 'listr'

const helpText = `Usage: [options] -m <string>
    where options include:
        --prompt or -p      Obtains necessary info by creating a user prompt.
        --feature or -f     Indicates the commit is in type of feature.
        --new or -new       Indicates the commit is in type of new
        --deploy or -d      Indicates the commit is in type of deploy.
        --hotfix or -h      Indicates the commit is in type of hotfix.
        --migrate or -mi    Indicates the commit is in type of migrate.
        --style or -s       Indicates the commit is in type of style.
        --test or -t        Indicates the commit is in type of test.
        --help              Prints help text on the terminal
        --message or -m <string> Sends mandatory commit message to git
    ℹ️ -m flag should always be given unless you use -p flag.
    ℹ️ -f, -n, -d, and -h options are unique. Which means you can only use one of 
    them in a command set. Giving more than one doesn't fire an error. Instead
    selects the first one. 
    ℹ️ When you use -p flag there is no need to indicate other options.`

const themeSet = [
    new Map([['💡', 'FEATURE']]),
    new Map([['🆕', 'NEW']]),
    new Map([['📦', 'DEPLOY']]),
    new Map([['🪑', 'HOTFIX']]),
    new Map([['🧳', 'MIGRATE']]),
    new Map([['🧁', 'STYLE']]),
    new Map([['🧪', 'TEST']]),
]

async function formatMessage(options) {
    if (options.help) {
        console.log('%s', chalk.blue.bold(helpText))
        process.exit(0)
    }
    if (
        !(
            options.feature ||
            options.new ||
            options.deploy ||
            options.hotfix ||
            options.migrate ||
            options.style ||
            options.test
        )
    ) {
        console.log(
            '%s: Commit type is missing in the command.',
            chalk.red.bold('ERROR')
        )
        console.log(
            '%s: Please use cli only with --help option for help.',
            chalk.blue.bold('INFO')
        )
        process.exit(-1)
    }
    if (options.message === 'A commit message') {
        console.log(
            '%s: Commit message is missing in the command.',
            chalk.red.bold('ERROR')
        )
        console.log(
            '%s: Please use cli only with --help option for help.',
            chalk.blue.bold('INFO')
        )
        process.exit(-1)
    }
    const targetThemeEntry = Array.from(
        options.feature
            ? themeSet[0]
            : options.new
            ? themeSet[1]
            : options.deploy
            ? themeSet[2]
            : options.hotfix
            ? themeSet[3]
            : options.migrate
            ? themeSet[4]
            : options.style
            ? themeSet[5]
            : options.test
            ? themeSet[6]
            : '❓'
    )
    return `${targetThemeEntry[0][0]} ${targetThemeEntry[0][1]}: ${options.message}`
}

function commit(messagePromise) {
    messagePromise.then(async (message) => {
        await execa('git', ['add', '.'])
        await execa('git', ['commit', '-m', message])
    })
}

export async function runTasks(options) {
    let formattedMessage
    const tasks = new Listr([
        {
            title: 'Format commit message',
            task: () => {
                formattedMessage = formatMessage(options)
            },
        },
        {
            title: 'Commit changes',
            task: () => commit(formattedMessage),
        },
    ])
    await tasks.run()
    console.log('%s: Commit is successful', chalk.green.bold('DONE'))
}
