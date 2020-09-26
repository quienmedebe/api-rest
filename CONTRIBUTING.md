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
7. Open a PR against develop (You have to change the base branch in case master is the default branch)
8. Squash and merge when the PR is approved. Add the ticket number and the description.

If you need to update your PR
9. Make your changes
10. `git pull --rebase origin develop`
11. `git push --force-with-lease feature/[Feature name]`

If there are any conflicts with the develop branch, you have to update your local branch with steps 10 and 11.

### How to prepare a release

1. `git checkout develop`
2. `git pull --rebase origin develop`
3. `git checkout -b release/[Version number]`
3. Bump version: `npm version [Type]`
4. Add required changes
5. `git pull --rebase origin develop`
6. `git push --force-with-lease origin release/[Version number]`

At this point, this release version should be deployed to the staging server. If there are any issues, fixes should be commited to the release branch.
On GitHub:
7. Open a PR against master
8. Rebase and Merge the PR when the PR is approved
9. Do the same with the develop branch and rebase if necessary
10. Tag a release on master with the version number added in the release branch: `git tag -a v[Version number] -m "[Tag message]"`
11. Export tag to the remote server: `git push origin [Tag name]`