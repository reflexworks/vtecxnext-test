'use client'

import { useState } from 'react'
import * as browserutil from 'utils/browserutil'
import { Props, useApi as isLoggedIn } from './useapi'
import Select from 'react-select'
import { Header } from 'components/header'
import * as testutil from 'utils/testutil'

const HomePage = () => {
  const props:Props = isLoggedIn()
  const [action, setAction] = useState<string>('')
  const [urlparam, setUrlparam] = useState<string>('')
  const [reqdata, setReqdata] = useState<string>('')
  const [uploadfiles, setUploadfiles] = useState<File[]>([])
  const [result, setResult] = useState<string>('')
  const [descriptionUrlparam, setDescriptionUrlparam] = useState<string>('')
  const [descriptionReqdata, setDescriptionReqdata] = useState<string>('')
  const [targetservice, setTargetservice] = useState<string>('')

  const options = [
    {
      label: 'uid',
      value: 'uid',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'uid2 (run twice)',
      value: 'uid2',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'whoami',
      value: 'whoami',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'is logged in',
      value: 'isloggedin',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'account',
      value: 'info_account',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'rxid',
      value: 'info_rxid',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'service',
      value: 'info_service',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'now',
      value: 'info_now',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'post log',
      value: 'log',
      labelUrlparam: '',
      labelReqdata: `[{
        "summary" : "「メッセージ」",
        "title" : "「タイトル(任意)」",
        "subtitle" : "「サブタイトル(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'get entry',
      value: 'getentry',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'get feed',
      value: 'getfeed',
      labelUrlparam: 'key={キー}',
      labelReqdata: `[{
        "title" : "「検索条件(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'get count',
      value: 'getcount',
      labelUrlparam: 'key={キー}',
      labelReqdata: `[{
        "title" : "「検索条件(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'post entry',
      value: 'postentry',
      labelUrlparam: '[key={親キー}]',
      labelReqdata: 'feed',
    },
    {
      label: 'put entry',
      value: 'putentry',
      labelUrlparam: '[isbulk&parallel&async]',
      labelReqdata: 'feed',
    },
    {
      label: 'delete entry',
      value: 'deleteentry',
      labelUrlparam: 'key={キー}[&r={リビジョン}]',
      labelReqdata: '',
    },
    {
      label: 'delete folder',
      value: 'deletefolder',
      labelUrlparam: 'key={親キー}[&async]',
      labelReqdata: '',
    },
    {
      label: 'clear folder',
      value: 'clearfolder',
      labelUrlparam: 'key={親キー}[&async]',
      labelReqdata: '',
    },
    {
      label: 'allocids',
      value: 'allocids',
      labelUrlparam: 'key={キー}&num={採番数}',
      labelReqdata: '',
    },
    {
      label: 'addids',
      value: 'addids',
      labelUrlparam: 'key={キー}&num={加算数}',
      labelReqdata: '',
    },
    {
      label: 'getids',
      value: 'getids',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'setids',
      value: 'setids',
      labelUrlparam: 'key={キー}&num={加算設定数}',
      labelReqdata: '',
    },
    {
      label: 'rangeids',
      value: 'rangeids',
      labelUrlparam: 'key={キー}&range={加算枠}',
      labelReqdata: '',
    },
    {
      label: 'get rangeids',
      value: 'getrangeids',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'get session feed',
      value: 'session_get_feed',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'get session entry',
      value: 'session_get_entry',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'get session string',
      value: 'session_get_string',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'get session long',
      value: 'session_get_long',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'set session feed',
      value: 'session_put_feed',
      labelUrlparam: 'name={名前}',
      labelReqdata: 'feed',
    },
    {
      label: 'set session entry',
      value: 'session_put_entry',
      labelUrlparam: 'name={名前}',
      labelReqdata: 'feed (entry1件)',
    },
    {
      label: 'set session string',
      value: 'session_put_string',
      labelUrlparam: 'name={名前}&val={値}',
      labelReqdata: '',
    },
    {
      label: 'set session long',
      value: 'session_put_long',
      labelUrlparam: 'name={名前}&val={数値}',
      labelReqdata: '',
    },
    {
      label: 'increment session',
      value: 'session_put_incr',
      labelUrlparam: 'name={名前}&val={数値}',
      labelReqdata: '',
    },
    {
      label: 'delete session feed',
      value: 'session_delete_feed',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'delete session entry',
      value: 'session_delete_entry',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'delete session string',
      value: 'session_delete_string',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'delete session long',
      value: 'session_delete_long',
      labelUrlparam: 'name={名前}',
      labelReqdata: '',
    },
    {
      label: 'pagination',
      value: 'paging_pagination',
      labelUrlparam: 'key={キー}&_pagination={ページ範囲}',
      labelReqdata: `[{
        "title" : "「検索条件(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'get page',
      value: 'paging_getpage',
      labelUrlparam: 'key={キー}&n={ページ番号}',
      labelReqdata: `[{
        "title" : "「検索条件(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'get page with pagination',
      value: 'paging_practical',
      labelUrlparam: 'key={キー}&n={ページ番号}',
      labelReqdata: `[{
        "title" : "「検索条件(任意)」"
      }] (feed に entry 1件のみ)`,
    },
    {
      label: 'post bigquery',
      value: 'bigquery_post',
      labelUrlparam: '[async&tablenames={エンティティの第一階層名}:{テーブル名},...]',
      labelReqdata: 'feed',
    },
    {
      label: 'delete bigquery',
      value: 'bigquery_delete',
      labelUrlparam: 'key={キー[,キー,...]}[&async&tablenames={エンティティの第一階層名}:{テーブル名},...]',
      labelReqdata: '',
    },
    {
      label: 'get bigquery',
      value: 'bigquery_put',
      labelUrlparam: '[csv={ダウンロードファイル名]',
      labelReqdata: `[{
        "title" : "「SQL」",
        "subtitle" : "「CSVヘッダ(任意)」",
        "category" : [
          {
            "___label" : "「パラメータ値(任意)」",
            "___term" : "「パラメータ型(string|number|boolean、デフォルトはstring)(任意)」"
          }, ...
        ]
      }]`,
    },
    {
      label: 'query rdb',
      value: 'rdb_put_query',
      labelUrlparam: '[csv={ダウンロードファイル名]',
      labelReqdata: `[{
        "title" : "「SQL」",
        "subtitle" : "「CSVヘッダ(任意)」",
        "category" : [
          {
            "___label" : "「パラメータ値(任意)」",
            "___term" : "「パラメータ型(string|number|boolean、デフォルトはstring)(任意)」"
          }, ...
        ]
      }]`,
    },
    {
      label: 'post bdb + bigquery (bdbq)',
      value: 'bdbq_post',
      labelUrlparam: '[key={親キー}&tablenames={エンティティの第一階層名}:{テーブル名},...]',
      labelReqdata: 'feed',
    },
    {
      label: 'put bdb + bigquery (bdbq)',
      value: 'bdbq_put',
      labelUrlparam: '[key={親キー}&tablenames={エンティティの第一階層名}:{テーブル名},...]',
      labelReqdata: 'feed',
    },
    {
      label: 'delete bdb + bigquery (bdbq)',
      value: 'bdbq_delete',
      labelUrlparam: 'key={キー[,キー,...]}[&tablenames={エンティティの第一階層名}:{テーブル名},...]',
      labelReqdata: '',
    },
    {
      label: 'exec rdb',
      value: 'rdb_put_exec',
      labelUrlparam: '',
      labelReqdata: `[{
        "title" : "「SQL」",
        "category" : [
          {
            "___label" : "「パラメータ値(任意)」",
            "___term" : "「パラメータ型(string|number|boolean、デフォルトはstring)(任意)」"
          }, ...
        ]
      }, ... ]`,
    },
    {
      label: 'create pdf',
      value: 'pdf',
      labelUrlparam: '[pdf={ダウンロードファイル名]',
      labelReqdata: 'PDFテンプレートHTML',
    },
    {
      label: 'put signature',
      value: 'signature_put_1',
      labelUrlparam: 'key={キー}[&r={リビジョン}]]',
      labelReqdata: '',
    },
    {
      label: 'put signatures',
      value: 'signature_put_2',
      labelUrlparam: '',
      labelReqdata: `[
        {
          "link" : [
            {"___rel": "self", "___href" : "「署名対象キー」"}
          ]
        }, ...
      ]`,
    },
    {
      label: 'delete signature',
      value: 'signature_delete',
      labelUrlparam: 'key={キー}[&r={リビジョン}]]',
      labelReqdata: '',
    },
    {
      label: 'check signature',
      value: 'signature_get',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'send mail',
      value: 'sendmail',
      labelUrlparam: 'to={to指定メールアドレス,...}[&cc={cc指定メールアドレス,...}&bcc={bcc指定メールアドレス,...}&attachments={添付ファイルのキー,...}]',
      labelReqdata: `{
        "title" : "「メールのタイトル」",
        "summary" : "「テキストメッセージ」",
        "content" : {
          "______text" : "「HTMLメッセージ」"
        }
      }
      `,
    },
    {
      label: 'push notification',
      value: 'pushnotification',
      labelUrlparam: 'to={Push通知送信先(グループ、UID、アカウントのいずれか),...}[&imageUrl={通知イメージURL(FCM用)}]',
      labelReqdata: `{
        "title" : "「Push通知タイトル(任意)」",
        "subtitle" : "「Push通知サブタイトル(任意)」",
        "content" : {
          "______text" : "「Push通知メッセージ本文」"
        },
        "category" : [
          {
            "___scheme" : "「dataのキー(Expo用)(任意)」",
            "___label" : "「dataの値(Expo用)(任意)」"
          }, ...
        ]
      }
      `,
    },
    {
      label: 'set message queue status',
      value: 'messagequeue_put',
      labelUrlparam: 'channel={チャネル}&flag={true|false}',
      labelReqdata: '',
    },
    {
      label: 'get message queue status',
      value: 'messagequeue_get_status',
      labelUrlparam: 'channel={チャネル}',
      labelReqdata: '',
    },
    {
      label: 'send message queue',
      value: 'messagequeue_post',
      labelUrlparam: 'channel={チャネル}',
      labelReqdata: `
      [
        {
          "link" : [
            {"___rel": "to", "___href" : "「メッセージ送信先(*(グループメンバー)、UID、アカウントのいずれか)」"}
          ],
          "summary" : "「メッセージ」",
          "title" : "「Push通知用タイトル(任意)」",
          "subtitle" : "「Push通知用サブタイトル(任意)」",
          "content" : {
            "______text" : "「Push通知用メッセージ本文」"
          },
          "category" : [
            {
              "___scheme" : "「Push通知用dataのキー(Expo用)(任意)」",
              "___label" : "「Push通知用dataの値(Expo用)(任意)」"
            }, ...
          ]
        }
      ]
      `,
    },
    {
      label: 'get message queue',
      value: 'messagequeue_get',
      labelUrlparam: 'channel={チャネル}',
      labelReqdata: '',
    },
    {
      label: 'add group',
      value: 'group_post_add',
      labelUrlparam: 'group={グループキー}[&selfid={グループエイリアスの末尾名}]',
      labelReqdata: '',
    },
    {
      label: 'add group by admin',
      value: 'group_post_addbyadmin',
      labelUrlparam: 'group={グループキー}[&selfid={グループエイリアスの末尾名}]',
      //labelReqdata: '[{"link": [{"___rel": "self", "___href": "/_user/{UID}"}]}, ...]',
      labelReqdata: '{"uids": ["{UID}", ...]}',
    },
    {
      label: 'create group admin',
      value: 'group_post_creategroupadmin',
      labelUrlparam: '',
      /*
      labelReqdata: `
      [
          {
              "link": [
                  {"___rel": "self", "___href": "/_group/{グループ名}"},
                  {"___rel": "via", "___title": "{グループ管理者のUID}"}, ...
              ]
          },
          ...
      ]
      `,
      */
      labelReqdata: `[{"group": "{グループ名}", "uids": ["{UID}", ...]} ...]`,
    },
    {
      label: 'delete group admin',
      value: 'group_delete_groupadmin',
      labelUrlparam: '[async]',
      labelReqdata: `{"group": ["{グループ名}", ...]}`,
    },
    {
      label: 'join group',
      value: 'group_put',
      labelUrlparam: 'group={グループ}[&selfid={グループエイリアスの末尾名}]',
      labelReqdata: '',
    },
    {
      label: 'leave group',
      value: 'group_delete_leave',
      labelUrlparam: 'group={グループ}',
      labelReqdata: '',
    },
    {
      label: 'leave group by admin',
      value: 'group_delete_leavebyadmin',
      labelUrlparam: 'group={グループキー}',
      //labelReqdata: '[{"link": [{"___rel": "self", "___href": "/_user/{UID}"}]}, ...]',
      labelReqdata: '{"uids": ["{UID}", ...]}',
    },
    {
      label: 'no group member',
      value: 'group_get_nogroupmember',
      labelUrlparam: 'group={グループのエイリアス(/_user/{UID}/group)}',
      labelReqdata: '',
    },
    {
      label: 'get groups',
      value: 'group_get_groups',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'is group member',
      value: 'group_get_isgroupmember',
      labelUrlparam: 'group={グループ(IDの値)}',
      labelReqdata: '',
    },
    {
      label: 'is admin',
      value: 'group_get_isadmin',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'send message',
      value: 'sendmessage',
      labelUrlparam: 'status={ステータス}&message={メッセージ}',
      labelReqdata: '',
    },
    {
      label: 'adduser by admin',
      value: 'user_post_adduserbyadmin',
      labelUrlparam: '',
      /*
      labelReqdata: `
      [
        {
          "contributor": [
              {
                  "uri": "urn:vte.cx:auth:{メールアドレス},{パスワード}",
                  "name": "{ニックネーム}"
              }
          ],
          "title": "メールのタイトル(任意)",
          "summary": "テキストメール本文(任意)",
          "content": {
              "______text": "HTMLメール本文(任意)"
          }
        },
        ...
      ]
      `,
      */
      labelReqdata: `[
        {
          "username": "{メールアドレス}",
          "pswd": "{パスワード}",
          "nickname": "{ニックネーム(任意)}",
          "emailSubject": "{メールのタイトル(任意)}",
          "emailText": "{テキストメール本文(任意)}",
          "emailHtml": "{HTMLメール本文(任意)}"
        },
        ...
      ]`
    },
    {
      label: 'adduser by group admin',
      value: 'user_post_adduserbygroupadmin',
      labelUrlparam: 'group={グループ名}',
      /*
      labelReqdata: `
      [
        {
          "contributor": [
              {
                  "uri": "urn:vte.cx:auth:{メールアドレス},{パスワード}",
                  "name": "{ニックネーム}"
              }
          ],
          "title": "メールのタイトル(任意)",
          "summary": "テキストメール本文(任意)",
          "content": {
              "______text": "HTMLメール本文(任意)"
          }
        },
        ...
      ]
      `,
      */
      labelReqdata: `[
        {
          "username": "{メールアドレス}",
          "pswd": "{パスワード}",
          "nickname": "{ニックネーム(任意)}",
          "emailSubject": "{メールのタイトル(任意)}",
          "emailText": "{テキストメール本文(任意)}",
          "emailHtml": "{HTMLメール本文(任意)}"
        },
        ...
      ]`
    },
    {
      label: 'changepass',
      value: 'user_put_changepass',
      labelUrlparam: '',
      labelReqdata: `{"newpswd": "{新パスワード}", "oldpswd": "{旧パスワード}"}`
    },
    {
      label: 'changepass by admin',
      value: 'user_put_changepassbyadmin',
      labelUrlparam: '',
      /*
      labelReqdata: `
      [
        {
          "contributor": [
            {
              "uri": "urn:vte.cx:auth:,{パスワード}"
            }
          ],
          "link": [
            {
              "___href": "/_user/{UID}/auth",
              "___rel": "self"
            }
          ]
        }
      ]
      `,
      */
      labelReqdata: `[{"uid": "{UID}", "pswd": "{パスワード}"}, ...]`,
    },
    {
      label: 'change account',
      value: 'user_put_changeaccount',
      labelUrlparam: '',
      /*
      labelReqdata: `
      [
        {
            "contributor": [
                {
                    "uri": "urn:vte.cx:auth:{メールアドレス}(,{パスワード}(任意))"
                }
            ],
            "title": "メールのタイトル(任意)",
            "summary": "テキストメール本文(任意)",
            "content": {
                "______text": "HTMLメール本文(任意)"
            }
        }
      ]
      `,
      */
      labelReqdata: `{
          "username": "{メールアドレス}",
          "emailSubject": "{メールのタイトル(任意)}",
          "emailText": "{テキストメール本文(任意)}",
          "emailHtml": "{HTMLメール本文(任意)}"
        }`
    },
    {
      label: 'change account verify',
      value: 'user_put_changeaccount_verify',
      labelUrlparam: 'verify={認証コード}',
      labelReqdata: '',
    },
    {
      label: 'merge an existing user with a line user',
      value: 'user_put_mergeoauthuser_line',
      labelUrlparam: 'account={アカウント}&pass={パスワード}',
      labelReqdata: '',
    },
    {
      label: 'userstatus',
      value: 'user_get_userstatus',
      labelUrlparam: '[account={アカウント}]',
      labelReqdata: '',
    },
    {
      label: 'revoke user',
      value: 'user_put_revokeuser',
      labelUrlparam: 'account={アカウント}',
      labelReqdata: '',
    },
    {
      label: 'revoke users',
      value: 'user_put_revokeusers',
      labelUrlparam: '',
      /*
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      [
        {
          "link": [
            {
              "___href": "/_user/{UID}",
              "___rel": "self"
            }
          ],
          "title": "{アカウント}"
        },
        ...
      ]
      `,
      */
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      {
        "accounts" : ["{アカウント}", ...],
        "uids" : ["{UID}", ...],
      }
      `,
    },
    {
      label: 'activate user',
      value: 'user_put_activateuser',
      labelUrlparam: 'account={アカウント}',
      labelReqdata: '',
    },
    {
      label: 'activate users',
      value: 'user_put_activateusers',
      labelUrlparam: '',
      /*
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      [
        {
          "link": [
            {
              "___href": "/_user/{UID}",
              "___rel": "self"
            }
          ],
          "title": "{アカウント}"
        },
        ...
      ]
      `,
      */
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      {
        "accounts" : ["{アカウント}", ...],
        "uids" : ["{UID}", ...],
      }
      `,
    },
    {
      label: 'cancel user',
      value: 'user_delete_canceluser',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'delete user',
      value: 'user_delete_deleteuser',
      labelUrlparam: 'account={アカウント}',
      labelReqdata: '',
    },
    {
      label: 'delete users',
      value: 'user_put_deleteusers',
      labelUrlparam: '',
      /*
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      [
        {
          "link": [
            {
              "___href": "/_user/{UID}",
              "___rel": "self"
            }
          ],
          "title": "{アカウント}"
        },
        ...
      ]
      `,
      */
      labelReqdata: `(アカウント・UIDいずれかを指定) 
      {
        "accounts" : ["{アカウント}", ...],
        "uids" : ["{UID}", ...],
      }
      `,
    },
    {
      label: 'save files',
      value: 'savefiles',
      labelUrlparam: 'key={親キー}[&bysize]',
      labelReqdata: 'ファイルアップロードでファイルを選択する',
    },
    {
      label: 'put content',
      value: 'putcontent',
      labelUrlparam: 'key={キー (ファイル名も含めて指定する)}[&bysize&filename={ダウンロード時のファイル名}]',
      labelReqdata: 'ファイルアップロードでファイルを選択する',
    },
    {
      label: 'post content (key is numbered)',
      value: 'postcontent',
      labelUrlparam: 'key={親キー}[&ext={拡張子}&filename={ダウンロード時のファイル名}]',
      labelReqdata: 'ファイルアップロードでファイルを選択する',
    },
    {
      label: 'delete content',
      value: 'deletecontent',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'get content',
      value: 'getcontent',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'add acl',
      value: 'acl_add',
      labelUrlparam: '',
      labelReqdata: ` 
      [
        {
          "link": [
            {
              "___href": "{キー}",
              "___rel": "self"
            }
          ],
          "contributor": [
            {
              "uri": "urn:vte.cx:acl:{ACL対象},{権限}"
            }, ...
          ]
        },
        ...
      ]
      `,
    },
    {
      label: 'remove acl',
      value: 'acl_remove',
      labelUrlparam: '',
      labelReqdata: ` 
      [
        {
          "link": [
            {
              "___href": "{キー}",
              "___rel": "self"
            }
          ],
          "contributor": [
            {
              "uri": "urn:vte.cx:acl:{ACL対象},{権限}"
            }, ...
          ]
        },
        ...
      ]
      `,
    },
    {
      label: 'add alias',
      value: 'alias_add',
      labelUrlparam: '',
      labelReqdata: ` 
      [
        {
          "link": [
            {
              "___href": "{キー}",
              "___rel": "self"
            },
            {
              "___href": "{エイリアス}",
              "___rel": "alternate"
            }, ...
          ]
        }, ...
      ]
      `,
    },
    {
      label: 'remove alias',
      value: 'alias_remove',
      labelUrlparam: '',
      labelReqdata: ` 
      [
        {
          "link": [
            {
              "___href": "{キー}",
              "___rel": "self"
            },
            {
              "___href": "{エイリアス}",
              "___rel": "alternate"
            }, ...
          ]
        }, ...
      ]
      `,
    },
    {
      label: 'get totp link',
      value: 'totp_post_getlink',
      labelUrlparam: '[chs={QRコードの1辺の長さ}]',
      labelReqdata: '',
    },
    {
      label: 'create totp',
      value: 'totp_post_create',
      labelUrlparam: '',
      labelReqdata: `{
        "feed" : {
          "title" : "{ワンタイムパスワード}"
        }
      }`,
    },
    {
      label: 'delete totp',
      value: 'totp_delete_totp',
      labelUrlparam: '[account={アカウント(サービス管理者のみ指定可)}]',
      labelReqdata: '',
    },
    {
      label: 'change tdid',
      value: 'totp_put_changetdid',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'line broadcast message',
      value: 'linemessage',
      labelUrlparam: '',
      labelReqdata: `[{
        "title" : "「メッセージ」",
        "rights" : "「チャネルアクセストークン(配列の先頭のみ指定)」"
      }, ...]`,
    },
    {
      label: 'health check',
      value: 'healthcheck',
      labelUrlparam: '',
      labelReqdata: '',
    },
    {
      label: 'get signed url (put content)',
      value: 'signedurl_put',
      labelUrlparam: 'key={キー (ファイル名も含めて指定する)}[&filename={ダウンロード時のファイル名}]',
      labelReqdata: '',
    },
    {
      label: 'get signed url (post content (key is numbered))',
      value: 'signedurl_post',
      labelUrlparam: 'key={親キー}[&ext={拡張子}&filename={ダウンロード時のファイル名}]',
      labelReqdata: '',
    },
    {
      label: 'get signed url (get content)',
      value: 'signedurl_get',
      labelUrlparam: 'key={キー}',
      labelReqdata: '',
    },
    {
      label: 'request to signed url (put content)',
      value: 'requesttosignedurl_put',
      labelUrlparam: '[get signed urlで指定したものと同じ、ダウンロード時のファイル名]',
      labelReqdata: '{署名付きURL}\nファイルアップロードでファイルを選択する',
    },
    {
      label: 'request to signed url (get content)',
      value: 'requesttosignedurl_get',
      labelUrlparam: '',
      labelReqdata: '{署名付きURL}',
    },
    {
      label: 'property',
      value: 'property',
      labelUrlparam: 'name={プロパティ名}',
      labelReqdata: '',
    },
    {
      label: 'logout',
      value: 'logout',
      labelUrlparam: '',
      labelReqdata: '',
    },
  ]

  const reactSelectStyles = {
    control: (baseStyles:any, state:any) => ({
      // セレクトボックス自体のスタイル
      ...baseStyles,
      width: 400,
    }),
    option: (baseStyles:any, state:any) => ({
      // セレクトボックスの中身のスタイル
      ...baseStyles,
      width: 400,
      paddingTop: 1,
      paddingBottom: 1,
    }),
    menu: (baseStyles:any, state:any) => ({
      ...baseStyles,
      width: 400,
    }),
  };

  /**
   * React Selectでオプションが選択された時に呼び出す関数.
   * @param option 選択されたoptionの内容
   */
  const onChangeReactSelect = (option: any) => {
    //console.log(`[onChangeOption] start. ${JSON.stringify(option)}`)
    if (option != null) {
      setAction(option.value)
      setDescriptionUrlparam(option.labelUrlparam)
      setDescriptionReqdata(option.labelReqdata)
    } else {
      setAction('')
      setDescriptionUrlparam('')
      setDescriptionReqdata('')
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[onFileInputChange] start. ${e.target.files}`)
    const files = e.target.files
    if (files && files.length > 0) {
      const tmpfiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        console.log(`[onFileInputChange] file = ${file?.name}`)
        if (file) {
          tmpfiles.push(file)
        }
      }
      setUploadfiles(tmpfiles)
    } else {
      console.log(`[onFileInputChange] files = null`)
      setUploadfiles([])
    }
  }
  
  const doRequest = async () => {
    setResult('')
    console.log(`[doRequest] start. action=${action}`)
    // selectの値を取得
    let method
    let headers
    let body
    let apiAction
    let additionalParam
    let isJson:boolean = true
    let filename = ''
    let url = ''

    if (action === 'uid' || action === 'uid2' || action === 'whoami' || 
        action === 'isloggedin' || action === 'logout' || 
        action === 'getentry' ||
        action === 'allocids' || action === 'getids' || action === 'getrangeids' ||
        action === 'sendmessage' || action === 'healthcheck' || action === 'property') {
      method = 'GET'
      apiAction = action
    } else if (action === 'log' || action === 'postentry' || action === 'sendmail' ||
        action === 'pushnotification' || action === 'getfeed' || action === 'getcount') {
      method = 'POST'
      body = reqdata
      apiAction = action
    } else if (action === 'putentry' || action === 'addids' || action === 'setids' || 
        action === 'rangeids') {
      method = 'PUT'
      body = reqdata
      apiAction = action
    } else if (action === 'deleteentry' || action === 'deletefolder' ||
        action === 'clearfolder' || action === 'deletecontent') {
      method = 'DELETE'
      apiAction = action
    } else if (action.startsWith('session_')) {
      const tmpAction = action.substring(8)
      console.log(`[doRequest] 'session_' + '${tmpAction}'`)
      const idx = tmpAction.indexOf('_')
      method = tmpAction.substring(0, idx)
      additionalParam = `type=${tmpAction.substring(idx + 1)}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      if (method) {
        apiAction = 'session'
        if (method === 'put') {
          body = reqdata
        }
      }
    } else if (action.startsWith('paging_')) {
      const type = action.substring(7)
      if (type === 'practical') {
        method = 'PUT'
      } else {
        method = 'POST'
      }
      apiAction = 'paging'
      body = reqdata
    } else if (action.startsWith('bigquery_')) {
      method = action.substring(9)
      apiAction = 'bigquery'
      if (method === 'post' || method === 'put') {
        body = reqdata
      }
      if ((method === 'put' || method === 'get') && urlparam.indexOf('csv') > -1) {
        console.log(`[doRequest] 'bigquery_${method}' & 'csv'`)
        isJson = false
        const idx = urlparam.indexOf('csv') + 4
        filename = urlparam.substring(idx)
      }
    } else if (action.startsWith('bdbq_')) {
      method = action.substring(5)
      apiAction = 'bdbq'
      if (method === 'post' || method === 'put') {
        body = reqdata
      }
    } else if (action === 'pdf') {
      method = 'PUT'
      body = reqdata
      apiAction = action
      isJson = false
      const idx = urlparam.indexOf('pdf') + 4
      filename = urlparam.substring(idx)
    } else if (action === 'getcontent') {
      method = 'GET'
      apiAction = action
      isJson = false
      const idx = urlparam.lastIndexOf('/')
      filename = urlparam.substring(idx + 1)
    } else if (action.startsWith('signature_')) {
      const tmpAction = action.substring(10)
      let tmpIdx = tmpAction.indexOf('_')
      const idx = tmpIdx < 0 ? tmpAction.length : tmpIdx
      method = tmpAction.substring(0, idx)
      apiAction = 'signature'
      if (method === 'put') {
        body = reqdata
      }
    } else if (action.startsWith('messagequeue_')) {
      const tmpAction = action.substring(13)
      console.log(`[doRequest] 'messagequeue_' + '${tmpAction}'`)
      const tmpIdx = tmpAction.indexOf('_')
      const idx = tmpIdx < 0 ? tmpAction.length : tmpIdx
      method = tmpAction.substring(0, idx)
      if (tmpIdx >= 0) {
        additionalParam = `type=${tmpAction.substring(idx + 1)}`
      }
      apiAction = 'messagequeue'
      if (method === 'put' || method === 'post') {
        body = reqdata
      }
    } else if (action.startsWith('group_')) {
      const tmpAction = action.substring(6)
      console.log(`[doRequest] 'group_' + '${tmpAction}'`)
      let idx = tmpAction.indexOf('_')
      if (idx === -1) {
        idx = tmpAction.length
      }
      method = tmpAction.substring(0, idx)
      additionalParam = `type=${tmpAction.substring(idx + 1)}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      if (method) {
        apiAction = 'group'
        if (method === 'post' || method === 'put' || method === 'delete') {
          body = reqdata
        }
      }
    } else if (action.startsWith('info_')) {
      method = 'GET'
      apiAction = 'info'
      additionalParam = `type=${action.substring(5)}`
    } else if (action.startsWith('user_')) {
      const tmpAction = action.substring(5)
      console.log(`[doRequest] 'user_' + '${tmpAction}'`)
      const idx = tmpAction.indexOf('_')
      method = tmpAction.substring(0, idx)
      additionalParam = `type=${tmpAction.substring(idx + 1)}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      if (method) {
        apiAction = 'user'
        if (method === 'post' || method === 'put') {
          body = reqdata
        }
      }
    } else if (action === 'savefiles') {
      method = 'POST'
      apiAction = action
      const formData = new FormData()
      if (uploadfiles) {
        for (const uploadfile of uploadfiles) {
          console.log(`[doRequest] [savefiles] uploadfile=${uploadfile.name} size=${uploadfile.size}`)
          formData.append(uploadfile.name, uploadfile, uploadfile.name)
        }
      }
      //headers = {'Content-Type' : 'multipart/form-data'}
      body = formData
    } else if (action === 'putcontent') {
      method = 'PUT'
      apiAction = action
      if (uploadfiles) {
        if (uploadfiles.length > 0) {
          const uploadfile = uploadfiles[0]
          console.log(`[doRequest] [putcontent] uploadfile=${uploadfile.name} Content-Type:${uploadfile.type} content-length:${uploadfile.size}`)
          body = uploadfile
          headers = {'content-type' : uploadfile.type, 'content-length' : uploadfile.size}

        } else {
          console.log(`[doRequest] [putcontent] uploadfile = undefined`)
        }
      }
    } else if (action === 'postcontent') {
      method = 'POST'
      apiAction = action
      if (uploadfiles) {
        if (uploadfiles.length > 0) {
          const uploadfile = uploadfiles[0]
          console.log(`[doRequest] [postcontent] uploadfile=${uploadfile.name} Content-Type:${uploadfile.type} content-length:${uploadfile.size}`)
          body = uploadfile
          headers = {'content-type' : uploadfile.type, 'content-length' : uploadfile.size}

        } else {
          console.log(`[doRequest] [postcontent] uploadfile = undefined`)
        }
      }
    } else if (action.startsWith('acl_')) {
      const tmpAction = action.substring(4)
      console.log(`[doRequest] 'acl_' + '${tmpAction}'`)
      method = 'PUT'
      additionalParam = `type=${tmpAction}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      apiAction = 'acl'
      body = reqdata
    } else if (action.startsWith('alias_')) {
      const tmpAction = action.substring(6)
      console.log(`[doRequest] 'alias_' + '${tmpAction}'`)
      method = 'PUT'
      additionalParam = `type=${tmpAction}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      apiAction = 'alias'
      body = reqdata
    } else if (action.startsWith('totp_')) {
      const tmpAction = action.substring(5)
      console.log(`[doRequest] 'totp_' + '${tmpAction}'`)
      const idx = tmpAction.indexOf('_')
      method = tmpAction.substring(0, idx)
      additionalParam = `type=${tmpAction.substring(idx + 1)}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      if (method) {
        apiAction = 'totp'
        if (method === 'post') {
          body = reqdata
        }
      }
    } else if (action === 'linemessage') {
      method = 'POST'
      apiAction = action
      body = reqdata
    } else if (action.startsWith('rdb_')) {
      const tmpAction = action.substring(4)
      console.log(`[doRequest] 'rdb_' + '${tmpAction}'`)
      const idx = tmpAction.indexOf('_')
      method = tmpAction.substring(0, idx)
      additionalParam = `type=${tmpAction.substring(idx + 1)}`
      console.log(`[doRequest] method=${method} additionalParam=${additionalParam}`)
      if (method) {
        apiAction = 'rdb'
        if (method === 'put') {
          body = reqdata
        }
      }
    } else if (action.startsWith('signedurl_')) {
      console.log(`[doRequest] signedurl.`)
      method = action.substring(10)
      console.log(`[doRequest] signedurl method=${method}`)
      if (method) {
        apiAction = 'signedurl'
      }
    } else if (action.startsWith('requesttosignedurl_')) {
      method = action.substring(19)
      console.log(`[doRequest] requesttosignedurl method=${method}`)
      if (method) {
        let filename = ''
        if (urlparam) {
          // ファイルの指定があればContent-Disposition
          filename = encodeURIComponent(urlparam)
          headers =  {'content-disposition' : `attachment; filename="${filename}"`}
        }
        url = reqdata
        console.log(`[doRequest] requesttosignedurl url=${url} filename=${filename}`)
        if (method === 'put') {
          if (uploadfiles) {
            if (uploadfiles.length > 0) {
              const uploadfile = uploadfiles[0]
              console.log(`[doRequest] [requesttosignedurl] uploadfile=${uploadfile.name} Content-Type:${uploadfile.type} content-length:${uploadfile.size}`)
              body = uploadfile
            } else {
              console.log(`[doRequest] [requesttosignedurl] uploadfile = undefined`)
            }
          }
        }
      }
    }

    if (method != null && apiAction != null) {
      additionalParam = `${additionalParam ? additionalParam : ''}${targetservice ? (additionalParam ? '&' : '') + 'targetservice=' + targetservice : ''}`
      const tmpUrlparam = `${urlparam ? urlparam : ''}${additionalParam ? (urlparam ? '&' : '') + additionalParam : ''}`
      const data = await browserutil.requestApi(method, apiAction, tmpUrlparam, body, headers)
      if (!data) {
        console.log(`[doRequest] data is null.`)
        setResult(`no data.`)
      } else if (isJson) {
        const feedStr = JSON.stringify(data)
        console.log(`[doRequest] data=${feedStr}`)
        setResult(feedStr)
      } else {
        // データダウンロード
        console.log(`[doRequest] isJson=false data=${data}`)

        const anchor = document.createElement("a")
        anchor.href = URL.createObjectURL(data)
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        URL.revokeObjectURL(anchor.href)
        document.body.removeChild(anchor)
      }

    } else if (method && url) {
      // 外部URLにリクエスト
      const data = await browserutil.requestUrl(method, url, body, headers)
      if (!data) {
        console.log(`[doRequest][requestUrl] data is null.`)
        setResult(`no data.`)
      } else if (testutil.isString(data)) {
        console.log(`[doRequest][requestUrl] data=${data}`)
        setResult(data)
      } else {
        // データダウンロード
        console.log(`[doRequest][requestUrl] isJson=false data=${data}`)

        const anchor = document.createElement("a")
        anchor.href = URL.createObjectURL(data)
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        URL.revokeObjectURL(anchor.href)
        document.body.removeChild(anchor)
      }

    } else {
      setResult(`no action: ${action}`)
    }
  }
  
  const sizeText = 54
  const rowTextarea = 5
  const colsTextarea = 50
  const sizeTargetservice = 20

  return (
    <div>
      <Header title="vtecxnext テスト" />
      <p>【useEffect】 is logged in: {props.isLoggedin}</p>
      <br/>
      <table>
        <tbody>
          <tr>
            <td>
              <span>機能:&nbsp;</span>
            </td>
            <td>
              <Select 
                options={options} 
                isSearchable={true} 
                isClearable={true} 
                onChange={onChangeReactSelect} 
                styles={reactSelectStyles}
              />
            </td>
            <td>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>連携サービス名: </span>
              <input type="text" size={sizeTargetservice} id="targetservice" name="targetservice" value={targetservice} 
                              onChange={(event) => setTargetservice(event.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top"><span>URLパラメータ: </span></td>
            <td valign="top"><input type="text" size={sizeText} id="urlparam" name="urlparam" value={urlparam} 
                       onChange={(event) => setUrlparam(event.target.value)} /></td>
            <td valign="top"><span>{descriptionUrlparam}</span></td>
          </tr>
          <tr>
            <td align="right" valign="top"><span>リクエストデータ: </span></td>
            <td valign="top"><textarea rows={rowTextarea} cols={colsTextarea} id="reqdata" name="reqdata" value={reqdata}
                       onChange={(event) => setReqdata(event.target.value)} /></td>
            <td valign="top"><span>{descriptionReqdata}</span></td>
          </tr>
          <tr>
            <td align="right" valign="top"><span>ファイルアップロード: </span></td>
            <td valign="top"><input type="file" multiple size={sizeText} id="uploadfile" name="uploadfile" 
                       onChange={onFileInputChange} /></td>
            <td valign="top">&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <button onClick={doRequest}>実行</button>
      &nbsp;&nbsp;
      <button onClick={(event) => setResult('')}>結果クリア</button>
      <br/>
      <p>実行結果: </p>
      <p>{result}</p>
      <br/>

    </div>
  )
}

export default HomePage
