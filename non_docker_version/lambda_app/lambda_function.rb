require "pg"
require "aws-sdk-s3"

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      # eventに入っている情報の確認
      p event
      # S3接続用のクライアントを作成
      client = Aws::S3::Client.new
      # バケット情報一覧を取得
      p client.list_buckets
      "Hello World"
    end
  end
end
