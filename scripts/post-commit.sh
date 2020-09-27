#!/bin/sh

echo
if [ -e .commit ]
    then
    rm .commit

    # Generate documentation
    npm run docs
    git add docs/*
    git add docs-html/*

    # Add files to commit
    git commit --amend -C HEAD --no-verify
fi
exit