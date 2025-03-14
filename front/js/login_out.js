//以下のコードはすべて動作未確認です。

// ユーザーのログイン状態をチェックする関数
// --------------------------------------------------
// この関数は、localStorage に保存されている "isLoggedIn" の値を確認します。
// 保存されている値が文字列 "true" と一致する場合、ユーザーはログイン状態と判断します。
function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// 表示を更新する関数
// --------------------------------------------------
// この関数は、ユーザーがログインしているかどうかに基づいてUIの表示を切り替えます。
// ・ログインしている場合、未ログイン用の要素（Login, Signup ボタン）を非表示にし、
//   ログイン用の要素（Logout ボタン）を表示します。
// ・未ログインの場合はその逆の表示となります。
function updateAuthDisplay() {
  // CSSクラス "tabs-auth logged-out" を持つ要素（未ログイン時に表示する領域）を取得
  const loggedOutSection = document.querySelector(".tabs-auth.logged-out");

  // CSSクラス "tabs-auth logged-in" を持つ要素（ログイン時に表示する領域）を取得
  const loggedInSection = document.querySelector(".tabs-auth.logged-in");

  // ユーザーのログイン状態に応じた処理
  if (isUserLoggedIn()) {
    // ユーザーがログインしている場合
    // 未ログイン向けの表示を隠し（display: none）、ログイン用の表示をブロック要素として表示
    loggedOutSection.style.display = "none";
    loggedInSection.style.display = "block";
  } else {
    // ユーザーがログインしていない場合
    // 未ログイン向けの表示をブロックとして表示し、ログイン用の表示を隠す
    loggedOutSection.style.display = "block";
    loggedInSection.style.display = "none";
  }
}

// ログアウト処理
// --------------------------------------------------
// この関数は、ユーザーがログアウトボタンをクリックしたときに呼び出されます。
// ・localStorage から "isLoggedIn" のフラグを削除してログアウト状態に設定し、
// ・画面の表示を更新します。
// 必要に応じてリダイレクト処理を追加することができます。
function logout() {
  // localStorage から "isLoggedIn" の情報を削除し、ログアウト状態にする
  localStorage.removeItem("isLoggedIn");

  // 最新のログイン状態に応じ、表示を更新する関数を呼び出す
  updateAuthDisplay();

  // ※ 追加の処理例:
  // ログアウト後、ホームページやログインページにリダイレクトする場合は以下を有効にしてください。
  // window.location.href = "index.html";
}

// DOM の読み込み完了時に実行する処理
// --------------------------------------------------
// DOMContentLoaded イベントは、HTML のパースと DOM ツリーの構築が完了したタイミングで発火します。
// このイベントリスナー内の処理は、ページの初期表示の状態を整え、必要なイベントを登録するために用います。
document.addEventListener("DOMContentLoaded", function () {
  // ページが読み込まれた段階で、現在のログイン状態に合わせた表示に更新する
  updateAuthDisplay();

  // ログイン時に表示されるログアウトボタンを取得
  // ※ログアウトボタンは ".tabs-auth.logged-in" 内に配置されているため、そのセレクタを指定して取得します。
  const logoutButton = document.querySelector(
    ".tabs-auth.logged-in .logout-button"
  );

  // ログアウトボタンが存在する場合にクリックイベントを登録する
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      // ボタンがクリックされたときに、リンクのデフォルト動作（ページ遷移）をキャンセル
      e.preventDefault();

      // ログアウト処理を実行
      logout();
    });
  }
});

// 例：ログイン成功時に呼び出す関数
// --------------------------------------------------
// この関数は、ユーザーが正しくログインに成功した場合に呼び出されます。
// ・localStorage に "isLoggedIn" のフラグを設定し、
// ・これにより updateAuthDisplay() が正しくUIを更新します。
// ※ 実際のアプリケーションでは、認証成功後にサーバーからのレスポンスを受けてこの関数を呼び出します。
function completeLogin() {
  // localStorage に "isLoggedIn" を "true" として保存し、ログイン状態を記録する
  localStorage.setItem("isLoggedIn", "true");

  // 保存した状態に応じた表示の更新を実行
  updateAuthDisplay();

  // ※ 追加の処理例:
  // ログイン成功後、特定のページ（例：ダッシュボード）にリダイレクトする場合はこちらを有効にしてください。
  // window.location.href = "dashboard.html";
}
