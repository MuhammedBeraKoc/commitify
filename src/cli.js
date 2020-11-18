import arg from 'arg'
import inquirer from 'inquirer'
import { runTasks } from './main'

const parseArgumentsIntoOptions = (rawArgs) => {
    const args = arg(
        {
            '--feature': Boolean,
            '--new': Boolean,
            '--deploy': Boolean,
            '--hotfix': Boolean,
            '--migrate': Boolean,
            '--style': Boolean,
            '--test': Boolean,
            '--prompt': Boolean,
            '--message': String,
            '--help': Boolean,
            '-f': '--feature',
            '-n': '--new',
            '-d': '--deploy',
            '-h': '--hotfix',
            '-mi': '--migrate',
            '-s': '--style',
            '-t': '--test',
            '-p': '--prompt',
            '-m': '--message',
        },
        {
            argv: rawArgs.slice(2),
        }
    )
    return {
        feature: args['--feature'] || false,
        new: args['--new'] || false,
        deploy: args['--deploy'] || false,
        hotfix: args['--hotfix'] || false,
        migrate: args['--migrate'] || false,
        style: args['--style'] || false,
        test: args['--test'] || false,
        prompt: args['--prompt'] || false,
        message: args['--message'] || 'A commit message',
        help: args['--help'] || false,
    }
}

async function promptForMissingOptions(options) {
    if (!options.prompt) {
        return {
            ...options,
        }
    }
    const questions = []
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
        questions.push({
            type: 'list',
            name: 'commitType',
            message: 'Please choose a commit type:',
            choices: [
                'feature',
                'new',
                'deploy',
                'hotfix',
                'migrate',
                'style',
                'test',
            ],
            default: '',
        })
    }
    if (options.message === 'A commit message') {
        questions.push({
            type: 'input',
            name: 'message',
            message: 'Please enter a commit message:',
        })
    }
    const answers = await inquirer.prompt(questions)
    return {
        ...options,
        message: answers.message || options.message,
        feature: answers.commitType === 'feature',
        new: answers.commitType === 'new',
        deploy: answers.commitType === 'deploy',
        hotfix: answers.commitType === 'hotfix',
        migrate: answers.commitType === 'migrate',
        style: answers.commitType === 'style',
        test: answers.commitType === 'test',
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args)
    options = await promptForMissingOptions(options)
    await runTasks(options)
}
