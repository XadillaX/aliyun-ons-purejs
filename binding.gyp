{
    "targets": [
        {
            "target_name": "cpp_util",
            "sources": [
                "./src/util.cpp"
            ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
