# CONTRIBUTING

## Merge flow with git and GitHub

### How to add a new feature

1. `git checkout develop`
2. `git pull --rebase origin develop`
3. `git checkout -b feature/[Feature name]`
4. Add and commit your changes
5. `git pull --rebase origin develop`
6. `git push origin feature/[Feature name]`

On GitHub:
7. Open pull request against develop (You have to change the base branch in case master is the default branch)
8. Squash and merge when the PR is approved. Add the ticket number and the description.

If you need to update your PR
9. Make your changes
10. `git pull --rebase origin develop`
11. `git push --force-with-lease feature/[Feature name]`

If there are any conflicts with the develop branch, you have to update your local branch with steps 10 and 11.