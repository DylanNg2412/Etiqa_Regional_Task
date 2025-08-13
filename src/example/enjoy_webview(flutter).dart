import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:smile_flutter/V6/config/configuration.dart';
import 'package:smile_flutter/V6/constants/colors.dart';
import 'package:smile_flutter/V6/constants/constants.dart';
import 'package:smile_flutter/V6/features/core/application/routes/router.gr.dart';
import 'package:smile_flutter/V6/features/core/helper/launcher_util.dart';
import 'package:smile_flutter/V6/features/enjoy/shared/providers.dart';
import 'package:smile_flutter/main_v6.dart';

class EnjoyWebview extends HookConsumerWidget {
  const EnjoyWebview({super.key, this.isFromPreHome});

  final bool? isFromPreHome;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final webViewController = useState<InAppWebViewController?>(null);
    final showBackButton = useState<bool>(false);

    Future<void> loadSessionStorage(InAppWebViewController controller) async {
      final accessToken = hiveReader.read(ACCESS_TOKEN) as String?;
      final refreshToken = hiveReader.read(REFRESH_TOKEN) as String?;

      final String jsonValue = '''
 {
  "accessToken": "${accessToken ?? ''}",
  "refreshToken": "${refreshToken ?? ''}"
}
  ''';

      // Escape special characters for JavaScript
      final escapedValue = jsonValue
          .replaceAll("'", r"\'")
          .replaceAll('\n', r'\n')
          .replaceAll('\r', r'\r');

      String script = """
    (function() {
      localStorage.setItem('session', '$escapedValue');
      sessionStorage.setItem('session', '$escapedValue');
    })();
  """;

      await controller.evaluateJavascript(source: script);
    }

    Future<void> clearWebStorage(InAppWebViewController controller) async {
      String script = """
    (function() {
      localStorage.removeItem('session');
      sessionStorage.removeItem('session');
    })();
  """;
      await controller.evaluateJavascript(source: script);
    }

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
        backgroundColor: EtiqaPlusColors.white,
        title: const Text(
          'Enjoy',
          style: TextStyle(fontSize: 16),
        ),
        actions: [
          IconButton(
              onPressed: () async {
                context.router.popUntilRouteWithName(
                  HomePageRoute.name,
                );
              },
              icon: const Icon(Icons.close)),
          const SizedBox(
            width: 10,
          ),
        ],
      ),
      body: Stack(
        children: [
          /// ✅ WebView
          InAppWebView(
            initialUrlRequest:
                URLRequest(url: WebUri(BuildConfig.get().enjoyUrl)),
            initialSettings: InAppWebViewSettings(
              useOnDownloadStart: true,
              mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
              safeBrowsingEnabled: false,
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserGesture: false,
              userAgent:
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            ),
            onWebViewCreated: (controller) {
              webViewController.value = controller;
              ref
                  .read(enjoyNotifierProvider.notifier)
                  .setWebviewController(controller: controller);
              clearWebStorage(controller);
              loadSessionStorage(controller);
            },
            onLoadStop: (controller, Uri? url) async {
              if (url != null) {
                if (url.toString() == BuildConfig.get().enjoyUrl) {
                  showBackButton.value = true;
                } else {
                  showBackButton.value = false;
                }
              }

              await loadSessionStorage(controller);
              if (!ref.read(enjoyNotifierProvider).hasReloaded) {
                await controller.reload();
                ref.read(enjoyNotifierProvider.notifier).setHasReloaded();
              }
            },
            shouldInterceptRequest: (controller, request) async {
              debugPrint('Request URL: ${request.url}');
              debugPrint('Request Headers: ${request.headers}');
              return null; // Continue the request
            },
            shouldOverrideUrlLoading: (controller, navigationAction) async {
              final url = navigationAction.request.url.toString();
              const privacyPolicy =
                  'https://www.etiqa.com.my/v2/privacy-notice';

              if (url == privacyPolicy) {
                await LauncherUtil.launchWebsite(privacyPolicy);
                return NavigationActionPolicy.CANCEL;
              }

              if (url.contains('wogi')) {
                await LauncherUtil.launchWebsite(url);
                return NavigationActionPolicy.CANCEL;
              }

              return NavigationActionPolicy.ALLOW;
            },
          ),

          /// ✅ Conditionally Show Back Button
          // if (showBackButton.value)
          //   Positioned(
          //     top: 40, // Adjust for safe area
          //     left: 16,
          //     child: GestureDetector(
          //       onTap: () async {
          //         if (webViewController.value != null) {
          //           bool canGoBack = await webViewController.value!.canGoBack();
          //           if (canGoBack) {
          //             await webViewController.value!.goBack();
          //           } else {
          //             Navigator.pop(context);
          //           }
          //         } else {
          //           Navigator.pop(context);
          //         }
          //       },
          //       child: Container(
          //         padding: const EdgeInsets.all(8),
          //         decoration: BoxDecoration(
          //           color: Colors.black.withOpacity(0.5),
          //           shape: BoxShape.circle,
          //         ),
          //         child: const Icon(
          //           Icons.arrow_back,
          //           color: Colors.white,
          //           size: 24,
          //         ),
          //       ),
          //     ),
          //   ),
        ],
      ),
    );
  }
}
