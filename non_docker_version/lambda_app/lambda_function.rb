require "fileutils"
require "aws-sdk-s3"

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      # eventはHash
      # インストールされているGemを出力する
      p installed_gems
      # S3接続用のクライアントを作成
      client = Aws::S3::Client.new
      # バケット情報一覧を取得する
      # #<struct Aws::S3::Types::ListBucketsOutput buckets=[#<struct Aws::S3::Types::Bucket name="名前", creation_date=日付>], owner=#<struct Aws::S3::Types::Owner display_name="xxxxx", id="yyyyy">>
      p client.list_buckets
      # オブジェクト情報一覧
      # #<struct Aws::S3::Types::ListObjectsV2Output is_truncated=false, contents=[#<struct Aws::S3::Types::Object key="名前", last_modified=日付, etag="\"xxxxx\"", checksum_algorithm=[], size=サイズ, storage_class="STANDARD", owner=nil, restore_status=nil>], name="bucket名", prefix="", delimiter=nil, max_keys=1000, common_prefixes=[], encoding_type=nil, key_count=1, continuation_token=nil, next_continuation_token=nil, start_after=nil, request_charged=nil>
      objects = client.list_objects_v2(bucket: event["bucketname"])
      # S3からオブジェクトを/tmpにコピーする
      objects.contents.each do |content|
        fname = content.key
        # フォルダの場合はコピー処理を行わない
        next if fname[-1] == "/"
        FileUtils.mkdir_p(File.dirname("/tmp/#{content.key}"))
        File.open("/tmp/#{fname}", "w") do |f|
            f.write(client.get_object(bucket: event["bucketname"], key: fname).body.read)
        end
      end
      "Hello World"
    end

    # インストール済みのGemを返す
    def self.installed_gems
      Gem::Specification.sort_by(&:name).map{ |g| "#{g.name} #{g.version}" }
    end
  end
end
