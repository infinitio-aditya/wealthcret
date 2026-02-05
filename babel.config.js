module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'react-native-reanimated/plugin',
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@navigation': './src/navigation',
                    '@store': './src/store',
                    '@services': './src/services',
                    '@hooks': './src/hooks',
                    '@types': './src/types',
                    '@utils': './src/utils',
                    '@theme': './src/theme',
                    '@constants': './src/constants',
                    '@assets': './src/assets',
                },
            },
        ],
    ],
};
